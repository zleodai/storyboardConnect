package project

import (
	"net/url"
	"strings"

	"github.com/storyboardconnect/server/internal/validator"
)

// ProjectFilter holds parsed and sanitized filter parameters for project queries.
type ProjectFilter struct {
	SearchQuery     string
	Formats         []string
	ProductionTypes []string
	Timelines       []string
}

// ParseFilter extracts project filter parameters from URL query values.
func ParseFilter(query url.Values) ProjectFilter {
	return ProjectFilter{
		SearchQuery:     validator.SanitizeString(
			validator.TruncateString(query.Get("searchQuery"), 200),
		),
		Formats:         parseArrayParam(query, "selectedFormats"),
		ProductionTypes: parseArrayParam(query, "selectedProductionTypes"),
		Timelines:       parseArrayParam(query, "selectedTimelines"),
	}
}

// parseArrayParam handles both "key=a,b,c" and "key=a&key=b&key=c" formats.
func parseArrayParam(query url.Values, key string) []string {
	values := query[key]
	if len(values) == 0 {
		values = query[key+"[]"]
	}
	if len(values) == 0 {
		return nil
	}
	if len(values) == 1 && strings.Contains(values[0], ",") {
		return validator.ParseCommaSeparated(values[0])
	}
	return validator.SanitizeStringSlice(values)
}
