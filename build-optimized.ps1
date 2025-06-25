# Enable BuildKit for faster Docker builds
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

Write-Host "🚀 Building with Docker BuildKit optimizations..." -ForegroundColor Green

# Build with cache mount and parallel layers
docker-compose build --parallel

Write-Host "✅ Build complete! Use 'docker-compose up' to start the services." -ForegroundColor Green
