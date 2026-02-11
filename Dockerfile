# ==========================
# Stage 1: Build the app
# ==========================
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (cache layer)
# Use npm install (not npm ci) to resolve correct platform-specific
# native bindings (e.g. @rollup/rollup-linux-x64-musl) since the
# lockfile may have been generated on a different OS (Windows/macOS).
COPY package.json package-lock.json* ./
RUN npm install --prefer-offline

# Copy source code
COPY . .

# Build args for Vite define replacements (baked into JS at build time)
ARG GEMINI_API_KEY=""
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_APP_ID=""

# Make build args available as env vars for Vite's build process
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

# ==========================
# Stage 2: Serve with nginx
# ==========================
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run uses port 8080 by default
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
