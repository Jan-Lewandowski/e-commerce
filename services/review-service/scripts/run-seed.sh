#!/bin/sh
set -e
echo "[startup] running seed"
node scripts/seed.js
echo "[startup] starting review-service"
exec node app.js
