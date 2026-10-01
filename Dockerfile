# =========================================================================
#  DevPulse — Production Web & Dev Server Container (Node 24 Latest)
# =========================================================================

FROM node:24-bookworm-slim AS base
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install dependencies (without legacy-peer-deps, modern resolved tree)
COPY package*.json ./
RUN npm ci || npm install

# Copy application source
COPY . .

# Build Vite distribution
RUN npm run build

# Expose DevPulse application port
EXPOSE 3000

# Start server
CMD ["npm", "run", "dev"]
