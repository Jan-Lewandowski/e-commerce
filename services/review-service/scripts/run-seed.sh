#!/bin/sh
set -e

read_secret() {
  tr -d '\r\n' < "$1"
}

if [ -z "$MONGODB_URI" ]; then
  MONGODB_PASSWORD="$(read_secret "$MONGODB_PASSWORD_FILE")"
  export MONGODB_URI="mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}?authSource=${MONGODB_AUTH_SOURCE}"
fi

echo "[startup] running seed"
node scripts/seed.js
echo "[startup] starting review-service"
exec node app.js
