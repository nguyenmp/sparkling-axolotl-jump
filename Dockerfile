# Build stage
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# Write .npmrc with correct array syntax for allowed build dependencies
RUN printf 'onlyBuiltDependencies[]=@swc/core\nonlyBuiltDependencies[]=esbuild\n' > .npmrc

RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/server ./server
COPY --from=build /app/nitro.config.ts ./

RUN pnpm install --frozen-lockfile --prod

EXPOSE 8080

CMD ["pnpm", "run", "preview"]