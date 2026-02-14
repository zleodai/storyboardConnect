package project

import (
	"context"
	"fmt"

	"github.com/storyboardconnect/server/internal/response"
	"github.com/storyboardconnect/server/internal/validator"
)

// Service contains the business logic for project operations.
type Service struct {
	repo Repository
}

// NewService creates a new project service.
func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

// GetProjects retrieves all projects matching the given filter.
func (s *Service) GetProjects(ctx context.Context, filter ProjectFilter) ([]ProjectResponse, error) {
	projects, err := s.repo.FindAll(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("get projects: %w", err)
	}
	return ToListResponse(projects), nil
}

// GetProjectByID retrieves a single project by ID.
func (s *Service) GetProjectByID(ctx context.Context, id string) (*ProjectResponse, error) {
	if !validator.IsValidUUID(id) {
		return nil, response.ErrBadRequest
	}

	project, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get project by id: %w", err)
	}
	if project == nil {
		return nil, response.ErrNotFound
	}

	resp := ToResponse(*project)
	return &resp, nil
}

// GetFeaturedProjects retrieves featured projects.
func (s *Service) GetFeaturedProjects(ctx context.Context) ([]ProjectResponse, error) {
	projects, err := s.repo.FindFeatured(ctx, 10)
	if err != nil {
		return nil, fmt.Errorf("get featured projects: %w", err)
	}
	return ToListResponse(projects), nil
}

// ApplyToProject creates an application for a project.
func (s *Service) ApplyToProject(ctx context.Context, projectID, userID string, req ApplyRequest) error {
	if !validator.IsValidUUID(projectID) || !validator.IsValidUUID(userID) {
		return response.ErrBadRequest
	}

	// Verify project exists
	project, err := s.repo.FindByID(ctx, projectID)
	if err != nil {
		return fmt.Errorf("verify project: %w", err)
	}
	if project == nil {
		return response.ErrNotFound
	}

	// Check for duplicate application
	existing, err := s.repo.FindApplication(ctx, projectID, userID)
	if err != nil {
		return fmt.Errorf("check existing application: %w", err)
	}
	if existing != nil {
		return response.ErrConflict
	}

	app := &Application{
		ProjectID: projectID,
		UserID:    userID,
		Message:   validator.SanitizeString(validator.TruncateString(req.Message, 2000)),
	}
	if req.PortfolioLink != "" {
		link := validator.SanitizeString(validator.TruncateString(req.PortfolioLink, 500))
		app.PortfolioLink = &link
	}

	return s.repo.CreateApplication(ctx, app)
}
