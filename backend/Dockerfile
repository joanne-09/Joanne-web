# --- Stage 0: Dependencies ---
# -----------------------------
FROM node:20-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

RUN cd backend && npm ci --omit=dev

# --- Stage 1: The Builder ---
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory.
COPY backend/package*.json backend/
COPY shared/package*.json shared/

# Install production dependencies. 'ci' is cleaner and faster for CI/CD.
RUN cd backend && npm ci

# Copy the rest of your application source code.
COPY backend/ ./backend/
COPY shared/ ./shared/

# Compile TypeScript files to JavaScript.
RUN cd backend && npx tsc

# --- Stage 2: The Final Image ---
# ---------------------------------
FROM node:20-alpine
WORKDIR /app

# Copy only the production dependencies manifest and install them
COPY --from=dependencies /app/backend/package*.json ./backend/
COPY --from=dependencies /app/shared/package*.json ./shared/
COPY --from=dependencies /app/backend/node_modules ./node_modules

# Copy the compiled JavaScript files from the builder stage.
COPY --from=builder /app/backend/dist ./dist

# Let Docker know that the app will listen on port 3001.
EXPOSE 3001

# The command that will be run when the container starts.
CMD [ "node", "dist/server.js" ]
