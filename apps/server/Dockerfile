# Build stage
FROM node:20-alpine AS builder

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run db:generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/documentation ./documentation
COPY --from=builder /app/package*.json ./

# Dar permissões ao usuário expressjs
RUN chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
