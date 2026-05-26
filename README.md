
## The application is under redevelopment to support a full-stack architecture.

# E-Commerce
<p align="center">
  <img width="1920" height="1080" alt="frontpage-e-commerce" src="https://github.com/user-attachments/assets/3cc26251-0bba-4821-bc9e-7d797251ca65" />
  <img width="1920" height="1080" alt="cart-page-e-commerce" src="https://github.com/user-attachments/assets/f81be594-c101-45e3-9fd8-f0f7349b3343" />
  <img width="1920" height="1080" alt="delivery-details-page-e-commerce" src="https://github.com/user-attachments/assets/8324e7a8-9c50-4d84-a1ab-77af4d83a4ed" />
  <img width="1920" height="1080" alt="order-summary-page-e-commerce" src="https://github.com/user-attachments/assets/fd1ec8ac-c50d-44dd-a8ad-731cc9f3f043" />
  <img width="1920" height="1080" alt="admin-panel-page-e-commerce" src="https://github.com/user-attachments/assets/88bd4037-fad9-481c-ac9b-c29c51b72100" />
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
