package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/storyboardconnect/server/internal/domain/user"
	"golang.org/x/oauth2"
)

// Service handles authentication logic including OAuth and JWT.
type Service struct {
	providers   *OAuthProviders
	userService *user.Service
	jwtSecret   string
}

// NewService creates a new auth service.
func NewService(providers *OAuthProviders, userService *user.Service, jwtSecret string) *Service {
	return &Service{
		providers:   providers,
		userService: userService,
		jwtSecret:   jwtSecret,
	}
}

// ValidateToken implements middleware.TokenValidator.
func (s *Service) ValidateToken(tokenString string) (userID, email, role string, err error) {
	claims, err := ParseToken(tokenString, s.jwtSecret)
	if err != nil {
		return "", "", "", err
	}
	return claims.UserID, claims.Email, claims.Role, nil
}

// GenerateState creates a random OAuth state parameter.
func GenerateState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// GoogleAuthURL returns the Google OAuth2 authorization URL.
func (s *Service) GoogleAuthURL(state string) (string, error) {
	if s.providers.Google == nil {
		return "", fmt.Errorf("google oauth not configured")
	}
	return s.providers.Google.AuthCodeURL(state, oauth2.AccessTypeOffline), nil
}

// GitHubAuthURL returns the GitHub OAuth2 authorization URL.
func (s *Service) GitHubAuthURL(state string) (string, error) {
	if s.providers.GitHub == nil {
		return "", fmt.Errorf("github oauth not configured")
	}
	return s.providers.GitHub.AuthCodeURL(state), nil
}

// HandleGoogleCallback exchanges the code for a token and upserts the user.
func (s *Service) HandleGoogleCallback(ctx context.Context, code string) (string, error) {
	if s.providers.Google == nil {
		return "", fmt.Errorf("google oauth not configured")
	}

	token, err := s.providers.Google.Exchange(ctx, code)
	if err != nil {
		return "", fmt.Errorf("google token exchange: %w", err)
	}

	// Fetch user info from Google
	client := s.providers.Google.Client(ctx, token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return "", fmt.Errorf("fetch google user info: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20)) // 1MB limit
	if err != nil {
		return "", fmt.Errorf("read google response: %w", err)
	}

	var googleUser struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}
	if err := json.Unmarshal(body, &googleUser); err != nil {
		return "", fmt.Errorf("parse google user info: %w", err)
	}

	var avatarURL *string
	if googleUser.Picture != "" {
		avatarURL = &googleUser.Picture
	}

	u, err := s.userService.FindOrCreateFromOAuth(
		ctx, "google", googleUser.ID, googleUser.Email, googleUser.Name, avatarURL,
	)
	if err != nil {
		return "", err
	}

	return GenerateToken(u.ID, u.Email, string(u.Role), s.jwtSecret)
}

// HandleGitHubCallback exchanges the code for a token and upserts the user.
func (s *Service) HandleGitHubCallback(ctx context.Context, code string) (string, error) {
	if s.providers.GitHub == nil {
		return "", fmt.Errorf("github oauth not configured")
	}

	token, err := s.providers.GitHub.Exchange(ctx, code)
	if err != nil {
		return "", fmt.Errorf("github token exchange: %w", err)
	}

	// Fetch user info from GitHub
	client := s.providers.GitHub.Client(ctx, token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		return "", fmt.Errorf("fetch github user info: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return "", fmt.Errorf("read github response: %w", err)
	}

	var ghUser struct {
		ID        int    `json:"id"`
		Login     string `json:"login"`
		Name      string `json:"name"`
		Email     string `json:"email"`
		AvatarURL string `json:"avatar_url"`
	}
	if err := json.Unmarshal(body, &ghUser); err != nil {
		return "", fmt.Errorf("parse github user info: %w", err)
	}

	// If email is private, fetch from emails endpoint
	email := ghUser.Email
	if email == "" {
		email, _ = s.fetchGitHubEmail(ctx, client)
	}

	name := ghUser.Name
	if name == "" {
		name = ghUser.Login
	}

	var avatarURL *string
	if ghUser.AvatarURL != "" {
		avatarURL = &ghUser.AvatarURL
	}

	providerID := fmt.Sprintf("%d", ghUser.ID)
	u, err := s.userService.FindOrCreateFromOAuth(
		ctx, "github", providerID, email, name, avatarURL,
	)
	if err != nil {
		return "", err
	}

	return GenerateToken(u.ID, u.Email, string(u.Role), s.jwtSecret)
}

// fetchGitHubEmail fetches the primary email from the GitHub emails endpoint.
func (s *Service) fetchGitHubEmail(ctx context.Context, client *http.Client) (string, error) {
	resp, err := client.Get("https://api.github.com/user/emails")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return "", err
	}

	var emails []struct {
		Email   string `json:"email"`
		Primary bool   `json:"primary"`
	}
	if err := json.Unmarshal(body, &emails); err != nil {
		return "", err
	}

	for _, e := range emails {
		if e.Primary {
			return e.Email, nil
		}
	}
	if len(emails) > 0 {
		return emails[0].Email, nil
	}
	return "", fmt.Errorf("no email found")
}
