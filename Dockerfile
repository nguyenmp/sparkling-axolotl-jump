# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the Vite + Nitro production output
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app

# Only copy what's needed at runtime
COPY --from=build /app/package.json /app/package-lock.json* ./
COPY --from=build /app/.output ./.output

# Install production-only dependencies
RUN npm ci --omit=dev && npm cache clean --force

# The app listens on the port set by the NITRO_PORT or PORT env var (default 3000)
ENV PORT=8080
EXPOSE 8080

USER node

CMD ["node", ".output/server/index.mjs"]