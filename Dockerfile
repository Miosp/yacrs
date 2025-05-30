FROM node:24-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* tsconfig.json svelte.config.js vite.config.ts ./
RUN npm ci
COPY static ./static
COPY prisma ./prisma
COPY src ./src
COPY .env.example .env
RUN npx prisma generate; \
    npm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

COPY --from=deps --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=builder --chown=sveltekit:nodejs /app/prisma ./prisma
COPY --from=builder --chown=sveltekit:nodejs /app/static ./static
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p /app/prisma && chown -R sveltekit:nodejs /app/prisma

USER sveltekit

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "build"]
