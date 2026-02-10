# ==============================
# Base stage: install dependencies
# ==============================
FROM node:20-alpine AS base

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy only package manifests for caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ==============================
# Dev stage: mounts + hot reload
# ==============================
FROM base AS dev

# Copy source code
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Dev command with hot reload
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# ==============================
# Prod stage: build + static server
# ==============================
FROM base AS prod

# Copy source code
COPY . .

# Build static files
RUN pnpm build

# Install a lightweight static server
RUN pnpm add -g serve

# Expose port
EXPOSE 5173

# Serve the static build
CMD ["serve", "-s", "dist", "-l", "5173"]
