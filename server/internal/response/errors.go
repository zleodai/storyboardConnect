package response

import (
	"errors"
	"net/http"
)

// Sentinel errors for domain operations.
var (
	ErrNotFound     = errors.New("resource not found")
	ErrBadRequest   = errors.New("bad request")
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
	ErrConflict     = errors.New("conflict")
	ErrInternal     = errors.New("internal server error")
)

// StatusFromError maps a domain error to an HTTP status code.
func StatusFromError(err error) int {
	switch {
	case errors.Is(err, ErrNotFound):
		return http.StatusNotFound
	case errors.Is(err, ErrBadRequest):
		return http.StatusBadRequest
	case errors.Is(err, ErrUnauthorized):
		return http.StatusUnauthorized
	case errors.Is(err, ErrForbidden):
		return http.StatusForbidden
	case errors.Is(err, ErrConflict):
		return http.StatusConflict
	default:
		return http.StatusInternalServerError
	}
}

// HandleError writes an appropriate HTTP error response based on the error type.
func HandleError(w http.ResponseWriter, err error) {
	status := StatusFromError(err)
	if status == http.StatusInternalServerError {
		// Don't leak internal details to the client
		Error(w, status, "internal server error")
	} else {
		Error(w, status, err.Error())
	}
}
