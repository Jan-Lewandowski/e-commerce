FROM node:26-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN apk add --no-cache wget bash \
  && addgroup -S auth \
  && adduser -S auth -G auth

COPY --from=deps /app/node_modules ./node_modules
COPY package.json knexfile.js app.js ./
COPY db ./db
COPY scripts ./scripts
COPY src ./src

RUN sed -i 's/\r$//' ./scripts/run-migrations.sh \
  && chmod +x ./scripts/run-migrations.sh

USER auth

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

CMD ["sh", "-c", "./scripts/run-migrations.sh"]
