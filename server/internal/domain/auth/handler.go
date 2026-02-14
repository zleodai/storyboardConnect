package auth

import (
	"log/slog"
	"net/http"
	"net/url"

	"github.com/storyboardconnect/server/internal/middleware"
	"github.com/storyboardconnect/server/internal/response"
)

// Handler holds the HTTP handlers for authentication endpoints.
type Handler struct {
	service     *Service
	frontendURL string
}

// NewHandler creates a new auth handler.
func NewHandler(service *Service, frontendURL string) *Handler {
	return &Handler{service: service, frontendURL: frontendURL}
}

// GoogleLogin redirects the user to Google's OAuth2 consent page.
func (h *Handler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	state := GenerateState()
	// Store state in a secure, HttpOnly cookie for CSRF protection
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		MaxAge:   300, // 5 minutes
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   r.TLS != nil,
	})

	authURL, err := h.service.GoogleAuthURL(state)
	if err != nil {
		slog.Error("google auth url", "error", err)
		response.Error(w, http.StatusInternalServerError, "oauth not configured")
		return
	}

	http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)
}

// GoogleCallback handles the OAuth2 callback from Google.
func (h *Handler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	// Verify state
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value != r.URL.Query().Get("state") {
		response.Error(w, http.StatusBadRequest, "invalid oauth state")
		return
	}

	// Clear the state cookie
	http.SetCookie(w, &http.Cookie{
		Name:   "oauth_state",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	code := r.URL.Query().Get("code")
	if code == "" {
		response.Error(w, http.StatusBadRequest, "missing authorization code")
		return
	}

	token, err := h.service.HandleGoogleCallback(r.Context(), code)
	if err != nil {
		slog.Error("google callback", "error", err)
		response.Error(w, http.StatusInternalServerError, "authentication failed")
		return
	}

	h.redirectWithToken(w, r, token)
}

// GitHubLogin redirects the user to GitHub's OAuth2 consent page.
func (h *Handler) GitHubLogin(w http.ResponseWriter, r *http.Request) {
	state := GenerateState()
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		MaxAge:   300,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   r.TLS != nil,
	})

	authURL, err := h.service.GitHubAuthURL(state)
	if err != nil {
		slog.Error("github auth url", "error", err)
		response.Error(w, http.StatusInternalServerError, "oauth not configured")
		return
	}

	http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)
}

// GitHubCallback handles the OAuth2 callback from GitHub.
func (h *Handler) GitHubCallback(w http.ResponseWriter, r *http.Request) {
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value != r.URL.Query().Get("state") {
		response.Error(w, http.StatusBadRequest, "invalid oauth state")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:   "oauth_state",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	code := r.URL.Query().Get("code")
	if code == "" {
		response.Error(w, http.StatusBadRequest, "missing authorization code")
		return
	}

	token, err := h.service.HandleGitHubCallback(r.Context(), code)
	if err != nil {
		slog.Error("github callback", "error", err)
		response.Error(w, http.StatusInternalServerError, "authentication failed")
		return
	}

	h.redirectWithToken(w, r, token)
}

// GetCurrentUser returns the authenticated user's info.
func (h *Handler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r.Context())
	email := middleware.GetUserEmail(r.Context())
	role := middleware.GetUserRole(r.Context())

	if userID == "" {
		response.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{
		"id":    userID,
		"email": email,
		"role":  role,
	})
}

// redirectWithToken redirects back to the frontend with the JWT as a query param.
func (h *Handler) redirectWithToken(w http.ResponseWriter, r *http.Request, token string) {
	redirectURL, _ := url.Parse(h.frontendURL)
	q := redirectURL.Query()
	q.Set("token", token)
	redirectURL.RawQuery = q.Encode()
	http.Redirect(w, r, redirectURL.String(), http.StatusTemporaryRedirect)
}
