package artist

import (
	"context"
	"fmt"

	"github.com/storyboardconnect/server/internal/response"
	"github.com/storyboardconnect/server/internal/validator"
)

// Service contains the business logic for artist operations.
type Service struct {
	repo Repository
}

// NewService creates a new artist service.
func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

// GetArtists retrieves all artists matching the given filter.
func (s *Service) GetArtists(ctx context.Context, filter ArtistFilter) ([]ArtistResponse, error) {
	artists, err := s.repo.FindAll(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("get artists: %w", err)
	}
	return ToListResponse(artists), nil
}

// GetArtistByID retrieves a single artist by ID.
func (s *Service) GetArtistByID(ctx context.Context, id string) (*ArtistResponse, error) {
	if !validator.IsValidUUID(id) {
		return nil, response.ErrBadRequest
	}

	artist, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get artist by id: %w", err)
	}
	if artist == nil {
		return nil, response.ErrNotFound
	}

	resp := ToResponse(*artist)
	return &resp, nil
}

// GetFeaturedArtists retrieves featured artists.
func (s *Service) GetFeaturedArtists(ctx context.Context) ([]ArtistResponse, error) {
	artists, err := s.repo.FindFeatured(ctx, 10)
	if err != nil {
		return nil, fmt.Errorf("get featured artists: %w", err)
	}
	return ToListResponse(artists), nil
}
