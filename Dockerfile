# ==========================
# Stage 1: Build the app
# ==========================
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (cache layer)
# Delete lockfile so npm resolves platform-correct native binaries
# (lockfile from Windows won't include @rollup/rollup-linux-x64-musl)
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build args for Vite define replacements — PUBLIC config only.
# NOTE: GEMINI_API_KEY is NOT a build arg. It is injected as a Cloud Run
# runtime environment variable and read by the Express server at startup.
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_APP_ID=""

# Make build args available as env vars for Vite's build process
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

# ==========================
# Stage 2: Run with Express
# ==========================
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install production deps only
COPY package.json ./
RUN npm install --omit=dev

# Copy the Express proxy server
COPY server/ ./server/

# Copy built static files from build stage
COPY --from=build /app/dist ./dist

# Cloud Run uses port 8080 by default
EXPOSE 8080

CMD ["node", "server/index.js"]
