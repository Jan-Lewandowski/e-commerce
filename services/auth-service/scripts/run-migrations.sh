#!/bin/sh
set -e

read_secret() {
  tr -d '\r\n' < "$1"
}

if [ -z "$DATABASE_URL" ]; then
  DB_PASSWORD="$(read_secret "$DB_PASSWORD_FILE")"
  export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

echo "[migrations] knex migrate:latest"
npm run db:migrate
echo "[migrations] knex seed:run"
npm run db:seed
echo "[migrations] done"
exec node app.js
