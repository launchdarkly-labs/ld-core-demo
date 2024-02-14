
# FROM node:18-alpine AS deps
FROM public.ecr.aws/docker/library/node:18-alpine3.18 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN  npm install --production

# FROM node:18-alpine AS builder
FROM public.ecr.aws/docker/library/node:18-alpine3.18 as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# FROM node:18-alpine AS runner
FROM public.ecr.aws/docker/library/node:18-alpine3.18 as runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./_next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.production ./

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
