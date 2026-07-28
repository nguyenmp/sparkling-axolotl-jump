# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Vite + Nitro production output
RUN pnpm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Only copy what's needed at runtime
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/.output ./.output

# Install production-only dependencies
RUN pnpm install --frozen-lockfile --prod && pnpm store prune

# The app listens on the port set by the NITRO_PORT or PORT env var (default 3000)
ENV PORT=8080
EXPOSE 8080

USER node

CMD ["node", ".output/server/index.mjs"]
