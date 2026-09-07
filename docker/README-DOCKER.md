# PyMacs Production Docker Container

## Multi-Architecture Container Support
- **Architectures:** `linux/amd64`, `linux/arm64` (Apple Silicon M1/M2/M3/M4 & Raspberry Pi 4/5)
- **Base Image:** `node:20-alpine` (builder) + `nginx:alpine` (runtime)
- **Image Size:** ~28MB compressed
- **Default Port:** `3000`

## Quick Start via Docker Compose
```bash
# Clone the repository
git clone https://github.com/bheemaiah-anil/pymacs.git
cd pymacs

# Spin up PyMacs operating system container
docker compose up -d

# Check running status
docker compose ps

# View live logs
docker compose logs -f
```
Open browser at: `http://localhost:3000`

## Quick Start via Docker Run
```bash
# Build locally
docker build -t pymacs:v4.2.0 .

# Run container
docker run -d --name pymacs_os -p 3000:3000 --restart unless-stopped pymacs:v4.2.0

# Open in browser
open http://localhost:3000 || xdg-open http://localhost:3000
```

## Pull from GitHub Container Registry (GHCR)
```bash
docker pull ghcr.io/bheemaiah-anil/pymacs:v4.2.0
docker run -d -p 3000:3000 ghcr.io/bheemaiah-anil/pymacs:v4.2.0
```
