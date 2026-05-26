import dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.PORT) || 3002;
export const databaseUrl = process.env.DATABASE_URL || '';
export const authInternalUrl = (process.env.AUTH_INTERNAL_URL || 'http://localhost:4000').replace(/\/+$/, '');
