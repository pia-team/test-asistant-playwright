# Use official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.48.0-noble

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Set default environment variables
ENV TEST_ENV=dev
ENV NODE_ENV=production

# Default command - can be overridden in Kubernetes
CMD ["npm", "run", "test:run"]
