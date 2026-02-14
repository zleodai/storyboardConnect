package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/storyboardconnect/server/internal/response"
)

const (
	userIDKey contextKey = "user_id"
	emailKey  contextKey = "user_email"
	roleKey   contextKey = "user_role"
)

// TokenValidator validates a JWT and returns claims. This is implemented by the
// auth service so middleware doesn't depend on the auth domain directly.
type TokenValidator interface {
	ValidateToken(tokenString string) (userID, email, role string, err error)
}

// Auth returns middleware that requires a valid Bearer token. Unauthenticated
// requests receive a 401 response.
func Auth(validator TokenValidator) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := extractBearerToken(r)
			if tokenString == "" {
				response.Error(w, http.StatusUnauthorized, "missing authorization token")
				return
			}

			userID, email, role, err := validator.ValidateToken(tokenString)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, userIDKey, userID)
			ctx = context.WithValue(ctx, emailKey, email)
			ctx = context.WithValue(ctx, roleKey, role)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// OptionalAuth extracts user info from the token if present, but does not
// reject unauthenticated requests.
func OptionalAuth(validator TokenValidator) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := extractBearerToken(r)
			if tokenString != "" {
				userID, email, role, err := validator.ValidateToken(tokenString)
				if err == nil {
					ctx := r.Context()
					ctx = context.WithValue(ctx, userIDKey, userID)
					ctx = context.WithValue(ctx, emailKey, email)
					ctx = context.WithValue(ctx, roleKey, role)
					r = r.WithContext(ctx)
				}
			}
			next.ServeHTTP(w, r)
		})
	}
}

// GetUserID retrieves the authenticated user's ID from the context.
func GetUserID(ctx context.Context) string {
	if id, ok := ctx.Value(userIDKey).(string); ok {
		return id
	}
	return ""
}

// GetUserEmail retrieves the authenticated user's email from the context.
func GetUserEmail(ctx context.Context) string {
	if email, ok := ctx.Value(emailKey).(string); ok {
		return email
	}
	return ""
}

// GetUserRole retrieves the authenticated user's role from the context.
func GetUserRole(ctx context.Context) string {
	if role, ok := ctx.Value(roleKey).(string); ok {
		return role
	}
	return ""
}

func extractBearerToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if auth == "" {
		return ""
	}
	parts := strings.SplitN(auth, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return strings.TrimSpace(parts[1])
}
