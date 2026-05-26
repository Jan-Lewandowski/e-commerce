import type { NextConfig } from "next";

// Option B (host dev without NGINX): browser calls same-origin /api/* on :3000;
// Next.js rewrites proxy to auth-service and product-service.
const authServiceUrl =
  process.env.AUTH_SERVICE_URL?.replace(/\/+$/, "") || "http://localhost:4000";
const productServiceUrl =
  process.env.PRODUCT_SERVICE_URL?.replace(/\/+$/, "") || "http://localhost:3002";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/uploads/products/:path*",
        destination: `${productServiceUrl}/uploads/products/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${authServiceUrl}/api/auth/:path*`,
      },
      {
        source: "/api/users/:path*",
        destination: `${authServiceUrl}/api/users/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${productServiceUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
