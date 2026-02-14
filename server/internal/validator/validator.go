package validator

import (
	"regexp"
	"strings"
	"unicode"
)

var uuidRegex = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)

// IsValidUUID checks if the string is a valid UUID v4 format.
func IsValidUUID(s string) bool {
	return uuidRegex.MatchString(s)
}

// SanitizeString trims whitespace and removes control characters.
func SanitizeString(s string) string {
	s = strings.TrimSpace(s)
	return strings.Map(func(r rune) rune {
		if unicode.IsControl(r) && r != '\n' && r != '\r' && r != '\t' {
			return -1 // drop the character
		}
		return r
	}, s)
}

// SanitizeStringSlice sanitizes each element and removes empty strings.
func SanitizeStringSlice(ss []string) []string {
	result := make([]string, 0, len(ss))
	for _, s := range ss {
		s = SanitizeString(s)
		if s != "" {
			result = append(result, s)
		}
	}
	return result
}

// ValidateEnum checks if a value is one of the allowed options.
func ValidateEnum(value string, allowed []string) bool {
	for _, a := range allowed {
		if value == a {
			return true
		}
	}
	return false
}

// TruncateString ensures a string does not exceed maxLen characters.
func TruncateString(s string, maxLen int) string {
	runes := []rune(s)
	if len(runes) > maxLen {
		return string(runes[:maxLen])
	}
	return s
}

// ParseCommaSeparated splits a comma-separated string into a sanitized slice.
func ParseCommaSeparated(s string) []string {
	if s == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	return SanitizeStringSlice(parts)
}
