FROM node:22-alpine AS build

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Configure pnpm to allow build scripts for @swc/core and esbuild
RUN printf 'pnpm.allowedBuiltDependencies[]=@swc/core\npnpm.allowedBuiltDependencies[]=esbuild\n' > .npmrc

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production image
FROM node:22-alpine

WORKDIR /app

# Copy built assets and server
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/nitro.config.ts ./nitro.config.ts

EXPOSE 8080

CMD ["node", "server/index.mjs"]