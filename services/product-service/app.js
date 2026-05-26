import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { port } from './src/config/env.js';
import pool from './src/db/pool.js';
import db from './src/db/knex.js';
import sequelize from './src/db/sequelize.js';
import prisma from './src/db/prisma.js';

import { mapPgError } from './src/middleware/mapPgError.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorMiddleware.js';

import productRoutes from './src/modules/catalog/routes/productRoutes.js';
import orderRoutes from './src/modules/orders/routes/orderRoutes.js';
import adminOrderRoutes from './src/modules/orders/routes/adminOrderRoutes.js';
import cartRoutes from './src/modules/cart/routes/cartRoutes.js';
import favoriteRoutes from './src/modules/favorites/routes/favoriteRoutes.js';
import supplierRoutes from './src/modules/suppliers/routes/supplierRoutes.js';
import promotionRoutes from './src/modules/promotions/routes/promotionRoutes.js';

import './src/modules/suppliers/models/Supplier.js';
import './src/modules/suppliers/models/ProductSupplier.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads/products', express.static(path.join(publicDir, 'uploads', 'products')));

app.get('/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

app.use('/api', productRoutes); // Knex
app.use('/api/orders', orderRoutes); // Knex, pg
app.use('/api/admin/orders', adminOrderRoutes); // admin list
app.use('/api/cart', cartRoutes); // Knex, per-user
app.use('/api/favorites', favoriteRoutes); // Knex, per-user
app.use('/api/suppliers', supplierRoutes); // Sequelize
app.use('/api/promotions', promotionRoutes); // Prisma

app.use(notFoundHandler);
app.use(mapPgError);
app.use(errorHandler);

//sequelize sync aby utworzyc tabele suppliers i product_suppliers przed startem serwera 
//jesli nie istnieja. bez tego endpointy suppliers nie dzialaja

await sequelize.sync({ alter: false });

const server = app.listen(port, () => {
  console.log(`product-service is running on port ${port}`);
});

async function shutdown(signal) {
  console.log(`[shutdown] ${signal} received`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      await sequelize.close();
      await db.destroy();
      await pool.end();
    } catch (err) {
      console.error('[shutdown] error', err.message);
    } finally {
      process.exit(0);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
