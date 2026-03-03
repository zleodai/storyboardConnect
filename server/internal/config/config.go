package config

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// Config holds all application configuration. Fields are exported but the struct
// is only constructed via Load(), ensuring validation runs before use.
type Config struct {
	Port              string
	Environment       string
	DatabaseURL       string
	JWTSecret         string
	GoogleClientID    string
	GoogleClientSecret string
	GoogleRedirectURL string
	GitHubClientID    string
	GitHubClientSecret string
	GitHubRedirectURL string
	FrontendURL       string
}

// Load reads configuration from environment variables (and optionally a .env file)
// and validates that all required fields are present.
func Load() (*Config, error) {
	// Attempt to load .env file if it exists (does not override existing env vars)
	loadDotEnv()

	cfg := &Config{
		Port:              getEnvOrDefault("PORT", "3000"),
		Environment:       getEnvOrDefault("ENVIRONMENT", "development"),
		DatabaseURL:       os.Getenv("DATABASE_URL"),
		JWTSecret:         os.Getenv("JWT_SECRET"),
		GoogleClientID:    os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		GoogleRedirectURL: os.Getenv("GOOGLE_REDIRECT_URL"),
		GitHubClientID:    os.Getenv("GITHUB_CLIENT_ID"),
		GitHubClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		GitHubRedirectURL: os.Getenv("GITHUB_REDIRECT_URL"),
		FrontendURL:       getEnvOrDefault("FRONTEND_URL", "http://localhost:5173"),
	}

	if err := cfg.validate(); err != nil {
		return nil, fmt.Errorf("config validation: %w", err)
	}

	return cfg, nil
}

func (c *Config) validate() error {
	if c.DatabaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}
	if c.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}
	return nil
}

// IsDevelopment returns true when running in development mode.
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

func getEnvOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

// loadDotEnv reads a .env file from the current directory or parent directory
// and sets environment variables that are not already set.
func loadDotEnv() {
	paths := []string{".env", "../.env", "server/.env"}
	for _, path := range paths {
		f, err := os.Open(path)
		if err != nil {
			continue
		}
		defer f.Close()

		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			key, value, found := strings.Cut(line, "=")
			if !found {
				continue
			}
			key = strings.TrimSpace(key)
			value = strings.TrimSpace(value)
			// Remove surrounding quotes if present
			value = strings.Trim(value, `"'`)
			// Only set if not already defined (env vars take precedence)
			if os.Getenv(key) == "" {
				os.Setenv(key, value)
			}
		}
		return // Only load the first .env file found
	}
}
