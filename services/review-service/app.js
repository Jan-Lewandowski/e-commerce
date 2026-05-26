import cors from 'cors';
import express from 'express';

import { mongodbUri, port } from './src/config/env.js';
import { closeMongo, connectMongo, getDb } from './src/db/mongoClient.js';
import { connectMongoose, disconnectMongoose } from './src/db/mongoose.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorMiddleware.js';
import analyticsRoutes from './src/modules/analytics/routes/analyticsRoutes.js';
import mongooseReviewRoutes from './src/modules/reviews-mongoose/routes/reviewRoutes.mongoose.js';
import nativeReviewRoutes from './src/modules/reviews-native/routes/reviewRoutes.native.js';

// wymusza zaladowanie modeli przed obsluga requestow
import './src/models/Review.js';
import './src/models/ReviewerProfile.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', async (_req, res, next) => {
  try {
    await getDb().command({ ping: 1 });
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/reviews', mongooseReviewRoutes);
app.use('/api/reviews', nativeReviewRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongo(mongodbUri);
await connectMongoose(mongodbUri);

const server = app.listen(port, () => {
  console.log(`review-service is running on port ${port}`);
});

async function shutdown(signal) {
  console.log(`[shutdown] ${signal} received`);
  server.close(async () => {
    try {
      await disconnectMongoose();
      await closeMongo();
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
