package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/storyboardconnect/server/internal/response"
)

type bucket struct {
	tokens   float64
	lastSeen time.Time
}

// RateLimit returns middleware that limits requests per IP using a token bucket.
func RateLimit(maxRequests float64, window time.Duration) func(http.Handler) http.Handler {
	var (
		mu      sync.Mutex
		buckets = make(map[string]*bucket)
	)
	refillRate := maxRequests / window.Seconds()

	// Background cleanup of stale entries
	go func() {
		for {
			time.Sleep(5 * time.Minute)
			mu.Lock()
			cutoff := time.Now().Add(-10 * time.Minute)
			for ip, b := range buckets {
				if b.lastSeen.Before(cutoff) {
					delete(buckets, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip, _, _ := net.SplitHostPort(r.RemoteAddr)
			if ip == "" {
				ip = r.RemoteAddr
			}

			mu.Lock()
			b, exists := buckets[ip]
			now := time.Now()
			if !exists {
				b = &bucket{tokens: maxRequests, lastSeen: now}
				buckets[ip] = b
			}

			// Refill tokens based on elapsed time
			elapsed := now.Sub(b.lastSeen).Seconds()
			b.tokens += elapsed * refillRate
			if b.tokens > maxRequests {
				b.tokens = maxRequests
			}
			b.lastSeen = now

			if b.tokens < 1 {
				mu.Unlock()
				w.Header().Set("Retry-After", "60")
				response.Error(w, http.StatusTooManyRequests, "rate limit exceeded")
				return
			}

			b.tokens--
			mu.Unlock()

			next.ServeHTTP(w, r)
		})
	}
}
