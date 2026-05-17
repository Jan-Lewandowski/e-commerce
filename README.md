
## The application is under redevelopment to support a full-stack architecture.

# E-Commerce
<p align="center">
  <img width="1920" height="1080" alt="frontpage-e-commerce" src="https://github.com/user-attachments/assets/3cc26251-0bba-4821-bc9e-7d797251ca65" />
  <img width="1920" height="1080" alt="cart-page-e-commerce" src="https://github.com/user-attachments/assets/f81be594-c101-45e3-9fd8-f0f7349b3343" />
  <img width="1920" height="1080" alt="delivery-details-page-e-commerce" src="https://github.com/user-attachments/assets/8324e7a8-9c50-4d84-a1ab-77af4d83a4ed" />
  <img width="1920" height="1080" alt="order-summary-page-e-commerce" src="https://github.com/user-attachments/assets/fd1ec8ac-c50d-44dd-a8ad-731cc9f3f043" />
  <img width="1920" height="1080" alt="admin-panel-page-e-commerce" src="https://github.com/user-attachments/assets/88bd4037-fad9-481c-ac9b-c29c51b72100" />
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
