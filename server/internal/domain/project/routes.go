package project

import (
	"github.com/go-chi/chi/v5"
	"github.com/storyboardconnect/server/internal/middleware"
)

// RegisterRoutes mounts project routes on the given router.
func RegisterRoutes(r chi.Router, h *Handler, authValidator middleware.TokenValidator) {
	r.Route("/projects", func(r chi.Router) {
		r.Get("/", h.GetProjects)
		r.Get("/featured", h.GetFeaturedProjects) // must be before /{id}
		r.Get("/{id}", h.GetProjectByID)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(authValidator))
			r.Post("/{id}/apply", h.ApplyToProject)
		})
	})
}
