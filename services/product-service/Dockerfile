FROM node:26-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json* ./

COPY prisma ./prisma
RUN npm install --omit=dev --no-audit --no-fund \
  && npx prisma generate

FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002

RUN apk add --no-cache wget bash openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY knexfile.js app.js ./
COPY db ./db
COPY data ./data
COPY prisma ./prisma
COPY scripts ./scripts
COPY public ./public
COPY src ./src

RUN sed -i 's/\r$//' ./scripts/run-all-migrations.sh \
  && chmod +x ./scripts/run-all-migrations.sh

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3002/health || exit 1

CMD ["sh", "-c", "./scripts/run-all-migrations.sh"]
