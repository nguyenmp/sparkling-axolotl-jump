FROM node:22-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Configure pnpm to allow build scripts for required packages
RUN printf 'pnpm.onlyBuiltDependencies[]=@swc/core\npnpm.onlyBuiltDependencies[]=esbuild\n' > .npmrc

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm build:dev

# Expose the port
EXPOSE 8080

# Start the server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]