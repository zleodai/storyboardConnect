.PHONY: run build test clean

# Run the server in development mode
run:
	go run ./cmd/server

# Build the server binary
build:
	go build -o bin/server ./cmd/server

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/
