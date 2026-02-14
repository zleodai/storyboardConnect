package artist

import "github.com/go-chi/chi/v5"

// RegisterRoutes mounts artist routes on the given router.
func RegisterRoutes(r chi.Router, h *Handler) {
	r.Route("/artists", func(r chi.Router) {
		r.Get("/", h.GetArtists)
		r.Get("/featured", h.GetFeaturedArtists) // must be before /{id}
		r.Get("/{id}", h.GetArtistByID)
	})
}
