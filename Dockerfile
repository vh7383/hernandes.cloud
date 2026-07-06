# --- deps : installe les dépendances seules, pour profiter du cache Docker
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder : build Next.js (sortie standalone)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner : image finale, légère
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# openssh-client : nécessaire à lib/kaliSleepScheduler.ts (ssh vers Kali).
RUN apk add --no-cache openssh-client

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
