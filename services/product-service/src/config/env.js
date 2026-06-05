import dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.PORT) || 3002;
export const databaseUrl = process.env.DATABASE_URL || '';
export const authInternalUrl = (process.env.AUTH_INTERNAL_URL || 'http://localhost:3001').replace(/\/+$/, '');
export const redisHost = process.env.REDIS_HOST || '';
export const redisPort = Number(process.env.REDIS_PORT) || 6379;
export const redisCacheTtlSeconds = Number(process.env.REDIS_CACHE_TTL_SECONDS) || 60;
