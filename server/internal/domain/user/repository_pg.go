package user

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type pgRepository struct {
	pool *pgxpool.Pool
}

// NewRepository creates a PostgreSQL-backed user repository.
func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepository{pool: pool}
}

func (r *pgRepository) FindByID(ctx context.Context, id string) (*User, error) {
	var u User
	err := r.pool.QueryRow(ctx,
		`SELECT id, email, name, provider, provider_id, role, avatar_url, created_at, updated_at
		 FROM users WHERE id = $1`,
		id,
	).Scan(
		&u.ID, &u.Email, &u.Name, &u.Provider, &u.ProviderID,
		&u.Role, &u.AvatarURL, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("find user by id: %w", err)
	}
	return &u, nil
}

func (r *pgRepository) FindByProviderID(ctx context.Context, provider, providerID string) (*User, error) {
	var u User
	err := r.pool.QueryRow(ctx,
		`SELECT id, email, name, provider, provider_id, role, avatar_url, created_at, updated_at
		 FROM users WHERE provider = $1 AND provider_id = $2`,
		provider, providerID,
	).Scan(
		&u.ID, &u.Email, &u.Name, &u.Provider, &u.ProviderID,
		&u.Role, &u.AvatarURL, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("find user by provider: %w", err)
	}
	return &u, nil
}

// Upsert inserts a new user or updates the existing one (matching provider + provider_id).
func (r *pgRepository) Upsert(ctx context.Context, u *User) (*User, error) {
	var result User
	err := r.pool.QueryRow(ctx,
		`INSERT INTO users (email, name, provider, provider_id, role, avatar_url)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 ON CONFLICT (provider, provider_id)
		 DO UPDATE SET
		   email = EXCLUDED.email,
		   name = EXCLUDED.name,
		   avatar_url = EXCLUDED.avatar_url,
		   updated_at = NOW()
		 RETURNING id, email, name, provider, provider_id, role, avatar_url, created_at, updated_at`,
		u.Email, u.Name, u.Provider, u.ProviderID, u.Role, u.AvatarURL,
	).Scan(
		&result.ID, &result.Email, &result.Name, &result.Provider, &result.ProviderID,
		&result.Role, &result.AvatarURL, &result.CreatedAt, &result.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("upsert user: %w", err)
	}
	return &result, nil
}
