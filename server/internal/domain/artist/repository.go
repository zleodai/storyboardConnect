package artist

import "context"

// Repository defines the data access interface for artists.
type Repository interface {
	FindAll(ctx context.Context, filter ArtistFilter) ([]Artist, error)
	FindByID(ctx context.Context, id string) (*Artist, error)
	FindFeatured(ctx context.Context, limit int) ([]Artist, error)
}
