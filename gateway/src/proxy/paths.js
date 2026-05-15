/**
 * Route → upstream mapping for when microservices are enabled.
 * Set PRODUCT_SERVICE_URL / REVIEW_SERVICE_URL in .env to activate proxies.
 */
export const productServiceRoutes = [
  '/api/categories',
  '/api/products',
  '/api/orders',
  '/api/admin/orders',
];

export const reviewServiceRoutes = [
  '/api/products/:productId/reviews',
  '/api/reviews',
];
