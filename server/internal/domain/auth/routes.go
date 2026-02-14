package auth

import (
	"github.com/go-chi/chi/v5"
	"github.com/storyboardconnect/server/internal/middleware"
)

// RegisterRoutes mounts auth routes on the given router.
func RegisterRoutes(r chi.Router, h *Handler, authValidator middleware.TokenValidator) {
	r.Route("/auth", func(r chi.Router) {
		r.Get("/google", h.GoogleLogin)
		r.Get("/google/callback", h.GoogleCallback)
		r.Get("/github", h.GitHubLogin)
		r.Get("/github/callback", h.GitHubCallback)

		// Protected
		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(authValidator))
			r.Get("/me", h.GetCurrentUser)
		})
	})
}
