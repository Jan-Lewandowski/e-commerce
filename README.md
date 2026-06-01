# E-Commerce
<p align="center">
  <img width="1920" height="1080" alt="frontpage-e-commerce" src="https://github.com/user-attachments/assets/3cc26251-0bba-4821-bc9e-7d797251ca65" />
  <img width="1920" height="1080" alt="cart-page-e-commerce" src="https://github.com/user-attachments/assets/f81be594-c101-45e3-9fd8-f0f7349b3343" />
  <img width="1920" height="1080" alt="delivery-details-page-e-commerce" src="https://github.com/user-attachments/assets/8324e7a8-9c50-4d84-a1ab-77af4d83a4ed" />
  <img width="1920" height="1080" alt="order-summary-page-e-commerce" src="https://github.com/user-attachments/assets/fd1ec8ac-c50d-44dd-a8ad-731cc9f3f043" />
  <img width="1920" height="1080" alt="admin-panel-page-e-commerce" src="https://github.com/user-attachments/assets/88bd4037-fad9-481c-ac9b-c29c51b72100" />
</p>

An example full-stack e-commerce demo implemented as modular services (frontend, auth, product, review) with a Docker-first developer experience. Knex, Sequelize and Prisma are included to showcase alternative approaches to relational database management; the `review-service` demonstrates MongoDB usage for document-based data.

## Features
- Browse and filter products
- Add to cart and manage favorites
- Place orders and view order history
- Supplier and admin dashboards
- Reviews service with seeding and aggregation

## Technologies
Below is a concise list of technologies and libraries used across the project by area.

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Material UI (MUI), TanStack Query, Formik, Yup
- **Auth service**: Node.js, Express, Knex (migrations & seeds), PostgreSQL, bcryptjs, dotenv
- **Product service**: Node.js, Express, Knex, Prisma (schema + migrations), Sequelize, PostgreSQL
- **Review service**: Node.js, Express, MongoDB native driver, Mongoose
- **API & infra**: RESTful services, NGINX as reverse proxy, Next.js rewrites for backend proxying, Docker & Docker Compose

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

## Notes
- Seed admin: `admin@example.com` / `password`.
