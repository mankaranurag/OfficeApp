# =========================================================================
#  DevPulse — Production Web & Dev Server Container (Node 24 Latest)
# =========================================================================

FROM node:24-bookworm-slim AS base
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install dependencies (Node 24 latest)
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build Vite distribution
RUN npm run build

# Expose DevPulse application port
EXPOSE 3000

# Start server
CMD ["npm", "run", "dev"]
