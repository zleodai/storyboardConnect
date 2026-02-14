package project

// ProjectResponse is the JSON representation matching the frontend Project interface.
type ProjectResponse struct {
	ID              string              `json:"id"`
	Title           string              `json:"title"`
	Subtitle        string              `json:"subtitle"`
	Image           string              `json:"image"`
	Logline         string              `json:"logline"`
	School          string              `json:"school"`
	Format          string              `json:"format"`
	Length          *string             `json:"length,omitempty"`
	Timeline        string              `json:"timeline"`
	ProductionType  string              `json:"productionType"`
	ShotlistReady   bool                `json:"shotlistReady"`
	LocationSecured bool                `json:"locationSecured"`
	IsPaid          bool                `json:"isPaid"`
	VisualDeckURL   *string             `json:"visualDeckUrl,omitempty"`
	ContactInfo     ContactInfoResponse `json:"contactInfo"`
}

// ContactInfoResponse is the JSON representation of contact info.
type ContactInfoResponse struct {
	Twitter   *string `json:"twitter,omitempty"`
	Instagram *string `json:"instagram,omitempty"`
	Email     *string `json:"email,omitempty"`
}

// ApplyRequest is the JSON body for applying to a project.
type ApplyRequest struct {
	Message       string `json:"message"`
	PortfolioLink string `json:"portfolioLink"`
}

// ToResponse converts a domain Project to a response DTO with defensive copies.
func ToResponse(p Project) ProjectResponse {
	resp := ProjectResponse{
		ID:              p.ID,
		Title:           p.Title,
		Subtitle:        p.Subtitle,
		Image:           p.Image,
		Logline:         p.Logline,
		School:          p.School,
		Format:          string(p.Format),
		Timeline:        p.Timeline,
		ProductionType:  string(p.ProductionType),
		ShotlistReady:   p.ShotlistReady,
		LocationSecured: p.LocationSecured,
		IsPaid:          p.IsPaid,
		ContactInfo: ContactInfoResponse{},
	}

	// Defensive copies of nullable fields
	if p.Length != nil {
		l := *p.Length
		resp.Length = &l
	}
	if p.VisualDeckURL != nil {
		u := *p.VisualDeckURL
		resp.VisualDeckURL = &u
	}
	if p.ContactInfo.Twitter != nil {
		t := *p.ContactInfo.Twitter
		resp.ContactInfo.Twitter = &t
	}
	if p.ContactInfo.Instagram != nil {
		i := *p.ContactInfo.Instagram
		resp.ContactInfo.Instagram = &i
	}
	if p.ContactInfo.Email != nil {
		e := *p.ContactInfo.Email
		resp.ContactInfo.Email = &e
	}

	return resp
}

// ToListResponse converts a slice of domain Projects to response DTOs.
func ToListResponse(projects []Project) []ProjectResponse {
	result := make([]ProjectResponse, len(projects))
	for i, p := range projects {
		result[i] = ToResponse(p)
	}
	return result
}
