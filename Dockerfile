# Babbagebox-Frontend Dockerfile
FROM node:20-slim as base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit --prefer-offline

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Use nginx for static file serving
FROM nginx:alpine as production
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
