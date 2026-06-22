package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	gh "github.com/meshbor/ai-university/api/internal/github"
)

type FeedbackHandler struct {
	github       *gh.Client
	githubRepo   string
	agentEnabled bool
}

func NewFeedbackHandler(githubToken, githubRepo string, agentEnabled bool) *FeedbackHandler {
	var client *gh.Client
	if githubToken != "" {
		client = gh.NewClient(githubToken, githubRepo)
	}
	return &FeedbackHandler{
		github:       client,
		githubRepo:   githubRepo,
		agentEnabled: agentEnabled,
	}
}

type feedbackRequest struct {
	Message      string          `json:"message"`
	Category     string          `json:"category"`
	Context      json.RawMessage `json:"context"`
	RequestAgent bool            `json:"requestAgent"`
}

type feedbackResponse struct {
	ID          string `json:"id"`
	IssueURL    string `json:"issueUrl"`
	AgentQueued bool   `json:"agentQueued,omitempty"`
}

func (h *FeedbackHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req feedbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		http.Error(w, "message required", http.StatusBadRequest)
		return
	}

	category := strings.TrimSpace(req.Category)
	if category == "" {
		category = "bug"
	}

	title := fmt.Sprintf("[feedback/%s] %s", category, truncate(req.Message, 72))
	body := buildIssueBody(req.Message, category, req.Context)

	labels := []string{"feedback"}
	if req.RequestAgent && h.agentEnabled {
		labels = append(labels, "agent")
	}

	if h.github == nil {
		issueURL := prefilledIssueURL(h.githubRepo, title, body, labels)
		writeJSON(w, http.StatusCreated, feedbackResponse{
			ID:       fmt.Sprintf("draft-%d", time.Now().UnixMilli()),
			IssueURL: issueURL,
		})
		return
	}

	issue, err := h.github.CreateIssue(title, body, labels)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	agentQueued := false
	if req.RequestAgent && h.agentEnabled {
		if err := h.github.DispatchRepository("agent-task", map[string]any{
			"issue_number": issue.Number,
			"issue_url":    issue.HTMLURL,
			"category":     category,
		}); err != nil {
			_ = h.github.CommentOnIssue(issue.Number,
				"⚠️ Не удалось поставить задачу в очередь агента автоматически. Добавь label `agent` вручную для повторного запуска.")
		} else {
			agentQueued = true
			_ = h.github.CommentOnIssue(issue.Number,
				"🤖 Задача поставлена в очередь агента. Draft PR появится через несколько минут.")
		}
	}

	writeJSON(w, http.StatusCreated, feedbackResponse{
		ID:          fmt.Sprintf("%d", issue.Number),
		IssueURL:    issue.HTMLURL,
		AgentQueued: agentQueued,
	})
}

func buildIssueBody(message, category string, context json.RawMessage) string {
	var b strings.Builder
	b.WriteString("## Сообщение\n\n")
	b.WriteString(message)
	b.WriteString("\n\n## Контекст\n\n")
	b.WriteString("- **Категория:** `")
	b.WriteString(category)
	b.WriteString("`\n")

	if len(context) > 0 && string(context) != "null" {
		var pretty bytes.Buffer
		if err := json.Indent(&pretty, context, "", "  "); err == nil {
			b.WriteString("\n<details>\n<summary>JSON контекст</summary>\n\n```json\n")
			b.Write(pretty.Bytes())
			b.WriteString("\n```\n\n</details>\n")
		}
	}

	b.WriteString("\n---\n_Отправлено из AI University (API /v1/feedback)_")
	return b.String()
}

func prefilledIssueURL(repo, title, body string, labels []string) string {
	labelParam := strings.Join(labels, ",")
	return fmt.Sprintf(
		"https://github.com/%s/issues/new?title=%s&body=%s&labels=%s",
		repo,
		urlQueryEscape(title),
		urlQueryEscape(body),
		urlQueryEscape(labelParam),
	)
}

func urlQueryEscape(s string) string {
	replacer := strings.NewReplacer(
		" ", "+",
		"\n", "%0A",
		"#", "%23",
		"&", "%26",
		"?", "%3F",
		"=", "%3D",
		"<", "%3C",
		">", "%3E",
		"\"", "%22",
		"'", "%27",
		"`", "%60",
		",", "%2C",
	)
	return replacer.Replace(s)
}

func truncate(s string, max int) string {
	s = strings.Join(strings.Fields(s), " ")
	if len(s) <= max {
		return s
	}
	return s[:max-1] + "…"
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
