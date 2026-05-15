import express from 'express';
import cors from 'cors';

import { port } from './src/config/env.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorMiddleware.js';
import { mountServiceProxies } from './src/proxy/setupProxy.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
mountServiceProxies(app);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});

export default app;
