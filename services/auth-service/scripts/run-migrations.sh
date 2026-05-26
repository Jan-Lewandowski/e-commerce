#!/bin/sh
set -e
echo "[migrations] knex migrate:latest"
npm run db:migrate
echo "[migrations] knex seed:run"
npm run db:seed
echo "[migrations] done"
exec node app.js
