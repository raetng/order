# ─── Stage 1: install all deps (including devDependencies for testing) ───────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ─── Stage 2: run tests ───────────────────────────────────────────────────────
FROM deps AS test
COPY src/ ./src/
RUN npm run test:ci

# ─── Stage 3: production deps only ───────────────────────────────────────────
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ─── Stage 4: final runtime image ────────────────────────────────────────────
FROM node:20-alpine AS final
WORKDIR /app

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --chown=appuser:appgroup --from=prod-deps /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package.json ./
COPY --chown=appuser:appgroup src/ ./src/

EXPOSE 3002

CMD ["node", "src/index.js"]
