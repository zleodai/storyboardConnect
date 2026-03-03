package artist

import (
	"net/url"

	"github.com/storyboardconnect/server/internal/validator"
)

// ArtistFilter holds parsed and sanitized filter parameters for artist queries.
type ArtistFilter struct {
	SearchQuery string
	Schools     []string
	BoardTypes  []string
	SortBy      string
}

// ParseFilter extracts artist filter parameters from URL query values.
// It handles both comma-separated and repeated parameter formats.
func ParseFilter(query url.Values) ArtistFilter {
	sortBy := validator.SanitizeString(query.Get("sortBy"))
	if !validator.ValidateEnum(sortBy, []string{"date"}) {
		sortBy = "date"
	}

	return ArtistFilter{
		SearchQuery: validator.SanitizeString(
			validator.TruncateString(query.Get("searchQuery"), 200),
		),
		Schools:    parseArrayParam(query, "selectedSchools"),
		BoardTypes: parseArrayParam(query, "selectedBoardTypes"),
		SortBy:     sortBy,
	}
}

// parseArrayParam handles both "key=a,b,c" and "key=a&key=b&key=c" formats.
func parseArrayParam(query url.Values, key string) []string {
	values := query[key]
	if len(values) == 0 {
		// Try bracket notation: key[]=a&key[]=b
		values = query[key+"[]"]
	}
	if len(values) == 0 {
		return nil
	}

	// If there's a single value with commas, split it
	if len(values) == 1 {
		return validator.ParseCommaSeparated(values[0])
	}

	return validator.SanitizeStringSlice(values)
}
