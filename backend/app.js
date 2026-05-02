import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/authRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;