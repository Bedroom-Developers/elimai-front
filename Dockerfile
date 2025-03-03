FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
COPY .yarn/releases/yarn-4.6.0.cjs .yarn/releases/
COPY .yarnrc.yml .

RUN yarn install --immutable

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM gcr.io/distroless/nodejs18-debian12 AS production
WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV HOSTNAME="0.0.0.0"
CMD ["server.js"]