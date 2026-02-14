package artist

import (
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/storyboardconnect/server/internal/response"
)

// Handler holds the HTTP handlers for artist endpoints.
type Handler struct {
	service *Service
}

// NewHandler creates a new artist handler.
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GetArtists handles GET /artists with optional filter query params.
func (h *Handler) GetArtists(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	artists, err := h.service.GetArtists(r.Context(), filter)
	if err != nil {
		slog.Error("get artists", "error", err)
		response.HandleError(w, err)
		return
	}

	response.List(w, artists)
}

// GetArtistByID handles GET /artists/{id}.
func (h *Handler) GetArtistByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	artist, err := h.service.GetArtistByID(r.Context(), id)
	if err != nil {
		slog.Error("get artist by id", "error", err, "id", id)
		response.HandleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, artist)
}

// GetFeaturedArtists handles GET /artists/featured.
func (h *Handler) GetFeaturedArtists(w http.ResponseWriter, r *http.Request) {
	artists, err := h.service.GetFeaturedArtists(r.Context())
	if err != nil {
		slog.Error("get featured artists", "error", err)
		response.HandleError(w, err)
		return
	}

	response.List(w, artists)
}
