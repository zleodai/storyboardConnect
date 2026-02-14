package project

import "time"

// Format represents the project format type.
type Format string

const (
	FormatMV         Format = "MV"
	FormatCommercial Format = "Commercial"
	FormatShortFilm  Format = "Short Film"
	FormatFeature    Format = "Feature"
)

// ProductionType represents the production category.
type ProductionType string

const (
	ProdCommercial ProductionType = "Commercial"
	ProdStudent    ProductionType = "Student"
	ProdIndie      ProductionType = "Indie"
	ProdOthers     ProductionType = "Others"
)

// ContactInfo holds the project's contact details.
type ContactInfo struct {
	Twitter   *string
	Instagram *string
	Email     *string
}

// Project is the domain model for a film/media project.
type Project struct {
	ID              string
	Title           string
	Subtitle        string
	Image           string
	Logline         string
	School          string
	Format          Format
	Length          *string
	Timeline        string
	ProductionType  ProductionType
	ShotlistReady   bool
	LocationSecured bool
	IsPaid          bool
	VisualDeckURL   *string
	ContactInfo     ContactInfo
	CreatedByUserID string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// Application represents a user's application to a project.
type Application struct {
	ID            string
	ProjectID     string
	UserID        string
	Message       string
	PortfolioLink *string
	Status        string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
