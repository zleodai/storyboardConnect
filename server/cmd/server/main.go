package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/storyboardconnect/server/internal/config"
	"github.com/storyboardconnect/server/internal/database"
	"github.com/storyboardconnect/server/internal/domain/artist"
	"github.com/storyboardconnect/server/internal/domain/auth"
	"github.com/storyboardconnect/server/internal/domain/project"
	"github.com/storyboardconnect/server/internal/domain/user"
	"github.com/storyboardconnect/server/internal/router"
)

func main() {
	// Structured JSON logging
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})))

	if err := run(); err != nil {
		slog.Error("server exited with error", "error", err)
		os.Exit(1)
	}
}

func run() error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}
	slog.Info("config loaded", "port", cfg.Port, "env", cfg.Environment)

	// Connect to database
	pool, err := database.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		return fmt.Errorf("database connection: %w", err)
	}
	defer pool.Close()
	slog.Info("database connected")

	// Run migrations
	if err := database.RunMigrations(ctx, pool, "migrations"); err != nil {
		return fmt.Errorf("migrations: %w", err)
	}
	slog.Info("migrations complete")

	// Initialize repositories
	artistRepo := artist.NewRepository(pool)
	projectRepo := project.NewRepository(pool)
	userRepo := user.NewRepository(pool)

	// Initialize services
	artistService := artist.NewService(artistRepo)
	projectService := project.NewService(projectRepo)
	userService := user.NewService(userRepo)

	// Initialize OAuth providers
	oauthProviders := auth.NewOAuthProviders(
		cfg.GoogleClientID, cfg.GoogleClientSecret, cfg.GoogleRedirectURL,
		cfg.GitHubClientID, cfg.GitHubClientSecret, cfg.GitHubRedirectURL,
	)
	authService := auth.NewService(oauthProviders, userService, cfg.JWTSecret)

	// Initialize handlers
	artistHandler := artist.NewHandler(artistService)
	projectHandler := project.NewHandler(projectService)
	authHandler := auth.NewHandler(authService, cfg.FrontendURL)

	// Build router
	r := router.New(cfg, router.DomainRoutes{
		RegisterArtistRoutes: func(r chi.Router) {
			artist.RegisterRoutes(r, artistHandler)
		},
		RegisterProjectRoutes: func(r chi.Router) {
			project.RegisterRoutes(r, projectHandler, authService)
		},
		RegisterAuthRoutes: func(r chi.Router) {
			auth.RegisterRoutes(r, authHandler, authService)
		},
	})

	// Create HTTP server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	errCh := make(chan error, 1)
	go func() {
		slog.Info("server starting", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
		close(errCh)
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-quit:
		slog.Info("shutdown signal received", "signal", sig)
	case err := <-errCh:
		return fmt.Errorf("server error: %w", err)
	}

	// Drain in-flight requests
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("server shutdown: %w", err)
	}

	slog.Info("server stopped gracefully")
	return nil
}
