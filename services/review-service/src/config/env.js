import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const port = Number(process.env.PORT) || 3003;
export const mongodbUri =
  process.env.MONGODB_URI ||
  'mongodb://ecommerce:ecommerce@localhost:27017/reviews?authSource=admin';
