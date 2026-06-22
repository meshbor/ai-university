package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/meshbor/ai-university/api/internal/chat"
)

type ChatHandler struct {
	openaiKey string
	openaiModel string
	client    *http.Client
}

func NewChatHandler(openaiKey, openaiModel string) *ChatHandler {
	if openaiModel == "" {
		openaiModel = "gpt-4o-mini"
	}
	return &ChatHandler{
		openaiKey:   openaiKey,
		openaiModel: openaiModel,
		client:      &http.Client{Timeout: 30 * time.Second},
	}
}

type chatRequest struct {
	Message string          `json:"message"`
	History []chatTurn      `json:"history"`
	Context json.RawMessage `json:"context"`
}

type chatTurn struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type chatResponse struct {
	Reply string `json:"reply"`
	Via   string `json:"via"`
}

func (h *ChatHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req chatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		http.Error(w, "message required", http.StatusBadRequest)
		return
	}

	var ctx *chat.Context
	if len(req.Context) > 0 && string(req.Context) != "null" {
		var parsed chat.Context
		if err := json.Unmarshal(req.Context, &parsed); err == nil {
			ctx = &parsed
		}
	}

	if h.openaiKey == "" {
		writeJSON(w, http.StatusOK, chatResponse{
			Reply: chat.AnswerLocal(req.Message, ctx),
			Via:   "local",
		})
		return
	}

	reply, err := h.callOpenAI(req.Message, req.History)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	writeJSON(w, http.StatusOK, chatResponse{Reply: reply, Via: "openai"})
}

func (h *ChatHandler) callOpenAI(message string, history []chatTurn) (string, error) {
	messages := []map[string]string{
		{"role": "system", "content": chat.SystemPrompt()},
	}
	for _, turn := range history {
		if turn.Role != "user" && turn.Role != "assistant" {
			continue
		}
		messages = append(messages, map[string]string{
			"role":    turn.Role,
			"content": turn.Content,
		})
	}
	messages = append(messages, map[string]string{"role": "user", "content": message})

	payload := map[string]any{
		"model":       h.openaiModel,
		"messages":    messages,
		"max_tokens":  600,
		"temperature": 0.3,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.openai.com/v1/chat/completions", bytes.NewReader(raw))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+h.openaiKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := h.client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return "", fmt.Errorf("openai api %d: %s", res.StatusCode, string(body))
	}

	var parsed struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", err
	}
	if len(parsed.Choices) == 0 {
		return "", fmt.Errorf("openai: empty response")
	}
	return strings.TrimSpace(parsed.Choices[0].Message.Content), nil
}
