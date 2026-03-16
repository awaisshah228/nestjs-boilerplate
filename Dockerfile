# ── Dependencies stage ──
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY libs/database/package.json ./libs/database/
COPY libs/commons/package.json ./libs/commons/

RUN yarn install --frozen-lockfile --production && \
    cp -R node_modules /prod_node_modules && \
    yarn install --frozen-lockfile

# ── Build stage (builds all apps) ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY nest-cli.json tsconfig.json ./
COPY apps ./apps
COPY libs ./libs

# Build all apps — add more as you create them
RUN npx nest build api && \
    find dist -name '*.map' -delete

# ── Base production stage ──
FROM node:20-alpine AS base

RUN apk add --no-cache dumb-init && \
    addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=deps --chown=app:app /prod_node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --chown=app:app package.json ./

ENV NODE_ENV=production

USER app

ENTRYPOINT ["dumb-init", "--"]

# ── API target ──
FROM base AS api

EXPOSE 3000
CMD ["node", "dist/apps/api/src/main.js"]

# ── Add more targets as you add apps ──
# FROM base AS worker
# EXPOSE 3001
# CMD ["node", "dist/apps/worker/src/main.js"]
