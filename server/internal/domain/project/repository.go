package project

import "context"

// Repository defines the data access interface for projects.
type Repository interface {
	FindAll(ctx context.Context, filter ProjectFilter) ([]Project, error)
	FindByID(ctx context.Context, id string) (*Project, error)
	FindFeatured(ctx context.Context, limit int) ([]Project, error)
	CreateApplication(ctx context.Context, app *Application) error
	FindApplication(ctx context.Context, projectID, userID string) (*Application, error)
}
