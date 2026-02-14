package user

import "time"

// Role represents a user's role in the system.
type Role string

const (
	RoleArtist  Role = "artist"
	RoleCreator Role = "creator"
	RoleAdmin   Role = "admin"
)

// User is the domain model for an authenticated user.
type User struct {
	ID         string
	Email      string
	Name       string
	Provider   string // "google" or "github"
	ProviderID string
	Role       Role
	AvatarURL  *string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
