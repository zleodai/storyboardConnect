package auth

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

// OAuthProviders holds OAuth2 configs for all supported providers.
type OAuthProviders struct {
	Google *oauth2.Config
	GitHub *oauth2.Config
}

// NewOAuthProviders creates OAuth2 configs from the provided credentials.
func NewOAuthProviders(
	googleClientID, googleSecret, googleRedirectURL string,
	githubClientID, githubSecret, githubRedirectURL string,
) *OAuthProviders {
	providers := &OAuthProviders{}

	if googleClientID != "" && googleSecret != "" {
		providers.Google = &oauth2.Config{
			ClientID:     googleClientID,
			ClientSecret: googleSecret,
			RedirectURL:  googleRedirectURL,
			Scopes:       []string{"openid", "email", "profile"},
			Endpoint:     google.Endpoint,
		}
	}

	if githubClientID != "" && githubSecret != "" {
		providers.GitHub = &oauth2.Config{
			ClientID:     githubClientID,
			ClientSecret: githubSecret,
			RedirectURL:  githubRedirectURL,
			Scopes:       []string{"user:email", "read:user"},
			Endpoint:     github.Endpoint,
		}
	}

	return providers
}
