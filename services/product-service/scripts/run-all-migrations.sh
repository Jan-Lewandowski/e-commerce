#!/bin/sh
# Runs all schema setup before starting product-service:
#   1. Prisma migrate deploy (T4) - applies first, so on a fresh DB Prisma
#      creates `_prisma_migrations` before Knex makes the schema "non-empty"
#      (Prisma refuses P3005 if it sees other tables and no own history).
#   2. Knex migrations (T2)  - creates categories, products, orders, order_items
#   3. Knex seed (T2)        - inserts catalog data
# Sequelize sync (T3) runs inside app.js on startup.
set -e

echo "[migrations] prisma migrate deploy"
npx prisma migrate deploy

echo "[migrations] knex migrate:latest"
npm run db:migrate

echo "[migrations] knex seed:run"
npm run db:seed

echo "[migrations] done"
