package middleware

import (
	"log/slog"
	"net/http"
	"runtime/debug"

	"github.com/storyboardconnect/server/internal/response"
)

// Recovery recovers from panics and returns a 500 JSON error.
func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				slog.Error("panic recovered",
					"error", err,
					"stack", string(debug.Stack()),
					"request_id", GetRequestID(r.Context()),
					"path", r.URL.Path,
				)
				response.Error(w, http.StatusInternalServerError, "internal server error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}
