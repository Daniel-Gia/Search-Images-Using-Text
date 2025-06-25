#!/bin/bash

# Enable BuildKit for faster Docker builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "🚀 Building with Docker BuildKit optimizations..."

# Build with cache mount and parallel layers
docker-compose build --parallel

echo "✅ Build complete! Use 'docker-compose up' to start the services."
