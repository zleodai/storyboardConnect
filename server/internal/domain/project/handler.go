package project

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/storyboardconnect/server/internal/middleware"
	"github.com/storyboardconnect/server/internal/response"
)

// Handler holds the HTTP handlers for project endpoints.
type Handler struct {
	service *Service
}

// NewHandler creates a new project handler.
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GetProjects handles GET /projects with optional filter query params.
func (h *Handler) GetProjects(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	projects, err := h.service.GetProjects(r.Context(), filter)
	if err != nil {
		slog.Error("get projects", "error", err)
		response.HandleError(w, err)
		return
	}

	response.List(w, projects)
}

// GetProjectByID handles GET /projects/{id}.
func (h *Handler) GetProjectByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	project, err := h.service.GetProjectByID(r.Context(), id)
	if err != nil {
		slog.Error("get project by id", "error", err, "id", id)
		response.HandleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, project)
}

// GetFeaturedProjects handles GET /projects/featured.
func (h *Handler) GetFeaturedProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := h.service.GetFeaturedProjects(r.Context())
	if err != nil {
		slog.Error("get featured projects", "error", err)
		response.HandleError(w, err)
		return
	}

	response.List(w, projects)
}

// ApplyToProject handles POST /projects/{id}/apply. Requires authentication.
func (h *Handler) ApplyToProject(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "id")
	userID := middleware.GetUserID(r.Context())
	if userID == "" {
		response.Error(w, http.StatusUnauthorized, "authentication required")
		return
	}

	var req ApplyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.service.ApplyToProject(r.Context(), projectID, userID, req); err != nil {
		slog.Error("apply to project", "error", err, "projectID", projectID, "userID", userID)
		response.HandleError(w, err)
		return
	}

	response.Created(w, map[string]string{"message": "application submitted"})
}
