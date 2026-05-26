FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3003

RUN apk add --no-cache wget bash \
  && addgroup -S review \
  && adduser -S review -G review

COPY --from=deps /app/node_modules ./node_modules
COPY package.json app.js ./
COPY data ./data
COPY scripts ./scripts
COPY src ./src

RUN sed -i 's/\r$//' ./scripts/run-seed.sh \
  && chmod +x ./scripts/run-seed.sh

USER review

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3003/health || exit 1

CMD ["sh", "-c", "./scripts/run-seed.sh"]
