# ==============================================================================
# PyMacs Browser Operating System - Docker Container Specification
# Multi-stage production container for PyMacs Microkernel & Web UI
# ==============================================================================

# Stage 1: Build Environment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies cleanly
RUN npm ci || npm install

# Copy source code and configuration
COPY . .

# Build production static assets
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM nginx:alpine AS runner

LABEL maintainer="Dr. Bheemaiah Anil K <bheemaiah@alumni.iitm.ac.in>"
LABEL description="PyMacs: An Operating System in Python with Antigravity DOM Engine"
LABEL version="4.2.0"

# Copy custom Nginx configuration for SPA routing on port 3000
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /downloads/ { \
        autoindex on; \
        add_header Content-Disposition "attachment"; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml; \
}' > /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy downloadable packages to nginx downloads folder
COPY --from=builder /app/public/downloads /usr/share/nginx/html/downloads

# Expose standard PyMacs port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
