package main

import (
	"log"
	"net/http"
	"os"

	"github.com/meshbor/ai-university/api/internal/handler"
	"github.com/meshbor/ai-university/api/internal/middleware"
)

func main() {
	addr := envOr("ADDR", ":8080")
	githubToken := os.Getenv("GITHUB_TOKEN")
	githubRepo := envOr("GITHUB_REPO", "meshbor/ai-university")
	agentEnabled := envOr("AGENT_DISPATCH_ENABLED", "true") != "false"
	openaiKey := os.Getenv("OPENAI_API_KEY")
	openaiModel := envOr("OPENAI_MODEL", "gpt-4o-mini")

	feedbackHandler := handler.NewFeedbackHandler(githubToken, githubRepo, agentEnabled)
	chatHandler := handler.NewChatHandler(openaiKey, openaiModel)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true}`))
	})
	mux.Handle("POST /v1/feedback", feedbackHandler)
	mux.Handle("POST /v1/chat", chatHandler)

	handler := middleware.CORS(mux)

	log.Printf("ai-university api listening on %s (github=%t openai=%t)", addr, githubToken != "", openaiKey != "")
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
