FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN apk add --no-cache wget \
  && addgroup -S gateway \
  && adduser -S gateway -G gateway

USER gateway

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY app.js data.js ./
COPY src ./src

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

CMD ["node", "app.js"]
