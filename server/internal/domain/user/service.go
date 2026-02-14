package user

import (
	"context"
	"fmt"

	"github.com/storyboardconnect/server/internal/response"
	"github.com/storyboardconnect/server/internal/validator"
)

// Service contains business logic for user operations.
type Service struct {
	repo Repository
}

// NewService creates a new user service.
func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

// FindOrCreateFromOAuth finds an existing user by provider or creates a new one.
func (s *Service) FindOrCreateFromOAuth(ctx context.Context, provider, providerID, email, name string, avatarURL *string) (*User, error) {
	u := &User{
		Email:      email,
		Name:       name,
		Provider:   provider,
		ProviderID: providerID,
		Role:       RoleArtist,
		AvatarURL:  avatarURL,
	}

	result, err := s.repo.Upsert(ctx, u)
	if err != nil {
		return nil, fmt.Errorf("find or create user: %w", err)
	}
	return result, nil
}

// GetByID retrieves a user by their ID.
func (s *Service) GetByID(ctx context.Context, id string) (*User, error) {
	if !validator.IsValidUUID(id) {
		return nil, response.ErrBadRequest
	}

	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get user by id: %w", err)
	}
	if user == nil {
		return nil, response.ErrNotFound
	}
	return user, nil
}
