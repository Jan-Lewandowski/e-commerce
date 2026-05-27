#!/bin/sh
# 1. prisma migrate db na czystej bazie prismy, 2. knex migrate db 3. knex seed 4. seqelize sync w app.js
set -e

echo "[migrations] prisma migrate deploy"
npx prisma migrate deploy

echo "[migrations] knex migrate:latest"
npm run db:migrate

echo "[migrations] knex seed:run"
npm run db:seed

echo "[migrations] done"
