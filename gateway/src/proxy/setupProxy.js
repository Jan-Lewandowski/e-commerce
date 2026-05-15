import { createProxyMiddleware } from 'http-proxy-middleware';

import { productServiceUrl, reviewServiceUrl } from '../config/env.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

function createServiceProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq(proxyReq, req) {
        if (req.auth?.user) {
          proxyReq.setHeader('X-User-Id', req.auth.user.id);
          proxyReq.setHeader('X-User-Email', req.auth.user.email);
          proxyReq.setHeader('X-User-Role', req.auth.user.role);
        }
      },
    },
  });
}

export function mountServiceProxies(app) {
  if (productServiceUrl) {
    const productProxy = createServiceProxy(productServiceUrl);

    app.use('/api/categories', productProxy);
    app.use('/api/products', productProxy);
    app.use('/api/orders', authenticate, productProxy);
    app.use('/api/admin/orders', requireAdmin, productProxy);
  }

  if (reviewServiceUrl) {
    const reviewProxy = createProxyMiddleware({
      target: reviewServiceUrl,
      changeOrigin: true,
      pathFilter: (pathname) => pathname.includes('/reviews'),
    });

    app.use('/api/reviews', createServiceProxy(reviewServiceUrl));
    app.use('/api/products', reviewProxy);
  }
}
