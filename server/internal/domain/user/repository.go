package user

import "context"

// Repository defines the data access interface for users.
type Repository interface {
	FindByID(ctx context.Context, id string) (*User, error)
	FindByProviderID(ctx context.Context, provider, providerID string) (*User, error)
	Upsert(ctx context.Context, user *User) (*User, error)
}
