package artist

import "time"

// AvailabilityStatus represents the artist's current availability.
type AvailabilityStatus string

const (
	StatusOpen        AvailabilityStatus = "open"
	StatusBusy        AvailabilityStatus = "busy"
	StatusUnavailable AvailabilityStatus = "unavailable"
)

// Availability holds the artist's availability details.
type Availability struct {
	Status        AvailabilityStatus
	NextAvailable *string
	Rate          *float64
}

// PortfolioProject represents a single portfolio item belonging to an artist.
type PortfolioProject struct {
	ID       string
	Title    string
	Image    string
	Tags     []string
	Category string
}

// Artist is the domain model. Fields are exported for repository scanning
// but consumers should use ToResponse() for external representation.
type Artist struct {
	ID             string
	Name           string
	Avatar         string
	Banner         string
	School         string
	Major          *string
	GraduationYear *string
	About          string
	TopSkills      []string
	BoardTypes     []string
	Portfolio      []PortfolioProject
	Availability   *Availability
	IsPremium      bool
	ViewCount      int
	UserID         string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
