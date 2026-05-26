
# E-Commerce
<p align="center">
  <img height="1080" width="18%" alt="Zrzut ekranu 2026-02-23 181749" src="https://github.com/user-attachments/assets/43fbb713-e3ed-4e0a-8729-20a8e9a4f4c6" />
  <img height="996" width="18%" alt="Zrzut ekranu 2026-02-23 181809" src="https://github.com/user-attachments/assets/838a1946-ffae-4e63-bf54-fd8311323f77" />
  <img height="1080" width="18%" alt="Zrzut ekranu 2026-02-23 181908" src="https://github.com/user-attachments/assets/606b78b8-3c14-4496-9ebe-d8fa3b482f31" />
  <img height="998" width="18%" alt="Zrzut ekranu 2026-02-23 181916" src="https://github.com/user-attachments/assets/0a7bb60f-6fcb-454c-a2e3-76104b46c7bb" />
  <img height="1001" width="18%" alt="Zrzut ekranu 2026-02-23 181956" src="https://github.com/user-attachments/assets/16d0b61d-ee70-4f65-ae84-33c7dfb1a7c3" />
</p>
An e-commerce application, allowing users to browse products, filter them, manage cart and favorites, place orders, and view order history.


## Run

### Option A — Docker Compose (recommended)

```bash
docker compose up --build
```

Open **http://localhost** (NGINX on port 80).

Services started:
- **NGINX** — public entry point
- **frontend** — Next.js (same-origin `/api/*` calls)
- **auth-service** — Postgres-backed users/sessions (Knex migrate + seed)
- **product-service** — Knex + Prisma migrations + seed
- **review-service** — MongoDB seed + reviews API
- **postgres** — databases `products` and `auth`
- **mongo** — database `reviews`

Seed admin: `admin@example.com` / `password`

Example review API calls (backend-only, via NGINX):

### Option B — All services on host (dev)

1. Start Postgres (e.g. `docker compose up postgres -d`) and ensure both databases exist: `products` and `auth`.
2. **auth-service:**
   ```bash
   cd services/auth-service
   npm install
   cp .env.example .env
   npm run db:migrate && npm run db:seed
   npm run dev
   ```
3. **product-service:**
   ```bash
   cd services/product-service
   npm install
   cp .env.example .env
   npm run db:migrate
   npx prisma migrate deploy
   npm run db:seed
   npm run dev
   ```
4. **review-service** (requires MongoDB, e.g. `docker compose up mongo -d`):
   ```bash
   cd services/review-service
   npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```
5. **frontend** (Next.js proxies `/api/*` to backend services via rewrites in `next.config.ts`):
   ```bash
   cd frontend && npm install
   cp .env.example .env.local
   npm run dev
   ```

Open http://localhost:3000 . Ensure auth-service runs on **:4000** and product-service on **:3002**.

### Frontend production build (without Docker)

```bash
cd frontend
npm run build
npm run start
```


## Notes
- Seed admin: `admin@example.com` / `password`.
