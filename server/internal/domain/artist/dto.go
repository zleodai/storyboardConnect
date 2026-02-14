package artist

// ArtistResponse is the JSON representation sent to the frontend.
// Defensive copies are made during construction so mutations to the
// original domain model do not affect the response.
type ArtistResponse struct {
	ID             string                     `json:"id"`
	Name           string                     `json:"name"`
	Avatar         string                     `json:"avatar"`
	Banner         string                     `json:"banner"`
	School         string                     `json:"school"`
	Major          *string                    `json:"major,omitempty"`
	GraduationYear *string                    `json:"graduationYear,omitempty"`
	About          string                     `json:"about"`
	TopSkills      []string                   `json:"topSkills"`
	BoardTypes     []string                   `json:"boardTypes"`
	Portfolio      []PortfolioProjectResponse `json:"portfolio"`
	Availability   *AvailabilityResponse      `json:"availability,omitempty"`
	IsPremium      *bool                      `json:"isPremium,omitempty"`
}

// PortfolioProjectResponse is the JSON representation of a portfolio item.
type PortfolioProjectResponse struct {
	ID       string   `json:"id"`
	Title    string   `json:"title"`
	Image    string   `json:"image"`
	Tags     []string `json:"tags"`
	Category string   `json:"category"`
}

// AvailabilityResponse is the JSON representation of availability.
type AvailabilityResponse struct {
	Status        string   `json:"status"`
	NextAvailable *string  `json:"nextAvailable,omitempty"`
	Rate          *float64 `json:"rate,omitempty"`
}

// ToResponse converts a domain Artist to a response DTO with defensive copies.
func ToResponse(a Artist) ArtistResponse {
	// Defensive copy of slices
	skills := make([]string, len(a.TopSkills))
	copy(skills, a.TopSkills)

	boardTypes := make([]string, len(a.BoardTypes))
	copy(boardTypes, a.BoardTypes)

	portfolio := make([]PortfolioProjectResponse, len(a.Portfolio))
	for i, p := range a.Portfolio {
		tags := make([]string, len(p.Tags))
		copy(tags, p.Tags)
		portfolio[i] = PortfolioProjectResponse{
			ID:       p.ID,
			Title:    p.Title,
			Image:    p.Image,
			Tags:     tags,
			Category: p.Category,
		}
	}

	resp := ArtistResponse{
		ID:             a.ID,
		Name:           a.Name,
		Avatar:         a.Avatar,
		Banner:         a.Banner,
		School:         a.School,
		About:          a.About,
		TopSkills:      skills,
		BoardTypes:     boardTypes,
		Portfolio:      portfolio,
	}

	// Copy nullable fields
	if a.Major != nil {
		major := *a.Major
		resp.Major = &major
	}
	if a.GraduationYear != nil {
		gy := *a.GraduationYear
		resp.GraduationYear = &gy
	}
	if a.IsPremium {
		premium := true
		resp.IsPremium = &premium
	}
	if a.Availability != nil {
		avail := &AvailabilityResponse{
			Status: string(a.Availability.Status),
		}
		if a.Availability.NextAvailable != nil {
			na := *a.Availability.NextAvailable
			avail.NextAvailable = &na
		}
		if a.Availability.Rate != nil {
			rate := *a.Availability.Rate
			avail.Rate = &rate
		}
		resp.Availability = avail
	}

	return resp
}

// ToListResponse converts a slice of domain Artists to response DTOs.
func ToListResponse(artists []Artist) []ArtistResponse {
	result := make([]ArtistResponse, len(artists))
	for i, a := range artists {
		result[i] = ToResponse(a)
	}
	return result
}
