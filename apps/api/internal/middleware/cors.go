package middleware

import (
	"net/http"
	"strings"
)

var allowedOrigins = []string{
	"http://localhost:5173",
	"https://meshbor.github.io",
}

// CORS wraps the handler with permissive CORS for known dev/prod origins.
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" && originAllowed(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func originAllowed(origin string) bool {
	for _, allowed := range allowedOrigins {
		if origin == allowed {
			return true
		}
	}
	// GitHub Pages preview deploys: https://meshbor.github.io
	if strings.HasPrefix(origin, "http://localhost:") {
		return true
	}
	return false
}
