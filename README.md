# E-Commerce

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
