# --- Stage 1: The Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory.
COPY package*.json ./
# Install production dependencies. 'ci' is cleaner and faster for CI/CD.
RUN npm ci

# Copy the rest of your application source code.
COPY . .

# Compile TypeScript files to JavaScript.
RUN npx tsc

# --- Stage 2: The Final Image ---
# Start from a fresh, clean base image.
FROM node:20-alpine

# Set the working directory.
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled JavaScript files from the builder stage.
COPY --from=builder /app/dist ./dist

# Let Docker know that the app will listen on port 3001.
# You'll map this to a host port when you run the container.
EXPOSE 3001

# The command that will be run when the container starts.
CMD [ "node", "dist/server.js" ]
