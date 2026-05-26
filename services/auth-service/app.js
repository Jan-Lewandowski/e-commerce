import express from 'express';
import cors from 'cors';

import { port } from './src/config/env.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import internalRoutes from './src/routes/internalRoutes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorMiddleware.js';
import db from './src/db/knex.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.get('/health', async (_req, res, next) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/internal', internalRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`auth-service is running on port ${port}`);
});

async function shutdown(signal) {
  console.log(`[shutdown] ${signal} received`);
  server.close(async () => {
    try {
      await db.destroy();
    } catch (error) {
      console.error('[shutdown] error', error.message);
    } finally {
      process.exit(0);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
