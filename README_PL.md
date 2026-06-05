# E-Commerce
<p align="center">
  <img width="1920" height="1080" alt="frontpage-e-commerce" src="https://github.com/user-attachments/assets/3cc26251-0bba-4821-bc9e-7d797251ca65" />
  <img width="1920" height="1080" alt="cart-page-e-commerce" src="https://github.com/user-attachments/assets/f81be594-c101-45e3-9fd8-f0f7349b3343" />
  <img width="1920" height="1080" alt="delivery-details-page-e-commerce" src="https://github.com/user-attachments/assets/8324e7a8-9c50-4d84-a1ab-77af4d83a4ed" />
  <img width="1920" height="1080" alt="order-summary-page-e-commerce" src="https://github.com/user-attachments/assets/fd1ec8ac-c50d-44dd-a8ad-731cc9f3f043" />
  <img width="1920" height="1080" alt="admin-panel-page-e-commerce" src="https://github.com/user-attachments/assets/88bd4037-fad9-481c-ac9b-c29c51b72100" />
</p>

Przykładowa aplikacja e-commerce w architekturze full‑stack, z podziałem na modułowe serwisy (frontend, auth, product, review) i podejściem „Docker‑first” dla programisty. W repozytorium znajdują się przykładowe podejścia do zarządzania relacyjną bazą danych: Knex, Sequelize i Prisma; `review-service` demonstruje użycie MongoDB dla danych dokumentowych.

## Funkcje
- Przegladanie i filtrowanie produktow
- Dodawanie do koszyka i zarzadzanie ulubionymi
- Skladanie zamowien i przeglad historii zamowien
- Panele dostawcy i administratora
- Serwis opinii z seedami i agregacjami

## Technologie
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Material UI (MUI), TanStack Query, Formik, Yup
- **Auth service**: Node.js, Express, Knex (migracje i seedy), PostgreSQL, bcryptjs, dotenv
- **Product service**: Node.js, Express, Knex, Prisma, Sequelize, PostgreSQL, dowod cache w Redis
- **Review service**: Node.js, Express, natywny driver MongoDB, Mongoose
- **API i infrastruktura**: REST, NGINX jako reverse proxy, Docker & Docker Compose

## Uruchomienie

### Opcja A - Docker Compose (zalecane)

```bash
docker compose up --build
```

Otworz **http://localhost** (NGINX na porcie 80).

Plik `.env.example` w katalogu glownym opisuje domyslna konfiguracje Compose. Hasla baz danych sa czytane z plikow w `secrets/`; domyslnie uzywane sa commitowane pliki `*.example`, zeby projekt dzialal bez dodatkowego przygotowania. Dla prywatnych lokalnych wartosci skopiuj pliki bez koncowki `.example` i ustaw `POSTGRES_PASSWORD_FILE` / `MONGO_PASSWORD_FILE`.

Uruchamiane uslugi:
- **NGINX** - publiczny punkt wejscia
- **frontend** - Next.js (wywolania `/api/*` w tej samej domenie)
- **auth-service** - uzytkownicy/sesje w Postgres (migracje Knex + seedy)
- **product-service** - migracje Knex + Prisma, seedy oraz dowod cache Redis na `GET /api/products`
- **review-service** - seedy MongoDB + API opinii
- **redis** - dodatkowy komponent wspierajacy aplikacje
- **postgres** - bazy `products` i `auth`
- **mongo** - baza `reviews`

Admin seed: `admin@example.com` / `password`

Obrazy aplikacji maja tag `${IMAGE_TAG:-v1}`. Uzyj `IMAGE_TAG=v2`, `IMAGE_TAG=v3` itd., kiedy chcesz zbudowac kolejna lokalna wersje.

Porty hosta dla Postgresa i MongoDB zostaja w `docker-compose.yml`, aby lokalny development byl prosty. Na produkcji nalezy usunac te mapowania portow i zostawic bazy tylko w sieci wewnetrznej Dockera.

Sprawdzenie Redisa:

```bash
docker compose exec redis redis-cli ping
```

### Opcja B - Wszystkie serwisy na hoscie (tryb deweloperski)

1. Uruchom Postgresa (np. `docker compose up postgres -d`) i upewnij sie, ze istnieja bazy `products` i `auth`.
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
4. **review-service** (wymaga MongoDB, np. `docker compose up mongo -d`):
   ```bash
   cd services/review-service
   npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```
5. **frontend** (Next.js proxyuje `/api/*` do backendow przez rewrites w `next.config.ts`):
   ```bash
   cd frontend && npm install
   cp .env.example .env.local
   npm run dev
   ```

Otworz http://localhost:3000. Upewnij sie, ze `auth-service` dziala na **:3001**, a `product-service` na **:3002**. Review 

## Uwagi
- Admin seed: `admin@example.com` / `password`.
