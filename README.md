
# E-Commerce
<p align="center">
  <img height="1080" width="18%" alt="Zrzut ekranu 2026-02-23 181749" src="https://github.com/user-attachments/assets/43fbb713-e3ed-4e0a-8729-20a8e9a4f4c6" />
  <img height="996" width="18%" alt="Zrzut ekranu 2026-02-23 181809" src="https://github.com/user-attachments/assets/838a1946-ffae-4e63-bf54-fd8311323f77" />
  <img height="1080" width="18%" alt="Zrzut ekranu 2026-02-23 181908" src="https://github.com/user-attachments/assets/606b78b8-3c14-4496-9ebe-d8fa3b482f31" />
  <img height="998" width="18%" alt="Zrzut ekranu 2026-02-23 181916" src="https://github.com/user-attachments/assets/0a7bb60f-6fcb-454c-a2e3-76104b46c7bb" />
  <img height="1001" width="18%" alt="Zrzut ekranu 2026-02-23 181956" src="https://github.com/user-attachments/assets/16d0b61d-ee70-4f65-ae84-33c7dfb1a7c3" />
</p>
An e-commerce application built with Next.js, allowing users to browse products, filter them, manage cart and favorites, place orders, and view order history.

## Technologies
- Frontend: Next.js 16, React 19, TypeScript
- UI and styling: SCSS, Material UI, Lucide Icons
- Forms and validation: Formik, Yup
- Data visualization: Recharts
- Application data: local JSON file + LocalStorage

## Requirements
- Node.js 18+
- npm 9+

## Run

### 1) Install dependencies
```bash
npm install
```

### 2) Start development environment
```bash
npm run dev
```

The application will be available at: http://localhost:3000

### 3) Production build
```bash
npm run build
npm run start
```


## Data and storage
- The product and category catalog is defined in `src/data.json`.
- User data, cart, favorites, order details, and order history are stored in browser LocalStorage.

## Features
- User registration and basic account management
- Product browsing with search, filtering, and categories
- Shopping cart with product quantity editing
- Favorite products list
- Order flow (delivery, address, payment, summary)
- Order history in the user account
- Admin panel with order preview and search (role `admin`)

## Notes
- The application does not require a separate backend — it runs on local data.
- To get admin role, set the username to `admin` during registration.
- Clear LocalStorage if you want to reset application state (account, cart, orders).
