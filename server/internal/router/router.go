package router

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/storyboardconnect/server/internal/config"
	"github.com/storyboardconnect/server/internal/middleware"
	"github.com/storyboardconnect/server/internal/response"
)

// DomainRoutes groups all domain route registrars. Each domain registers its
// own routes on the provided sub-router.
type DomainRoutes struct {
	RegisterArtistRoutes  func(r chi.Router)
	RegisterProjectRoutes func(r chi.Router)
	RegisterAuthRoutes    func(r chi.Router)
}

// New builds the chi router with all middleware and route groups.
func New(cfg *config.Config, domains DomainRoutes) chi.Router {
	r := chi.NewRouter()

	// Global middleware stack (order matters)
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recovery)
	r.Use(middleware.SecureHeaders)
	r.Use(middleware.CORS(cfg.FrontendURL))
	r.Use(middleware.RateLimit(100, time.Minute))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	// API routes
	r.Route("/api", func(r chi.Router) {
		if domains.RegisterArtistRoutes != nil {
			domains.RegisterArtistRoutes(r)
		}
		if domains.RegisterProjectRoutes != nil {
			domains.RegisterProjectRoutes(r)
		}
		if domains.RegisterAuthRoutes != nil {
			domains.RegisterAuthRoutes(r)
		}
	})

	return r
}
