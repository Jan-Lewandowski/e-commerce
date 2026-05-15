import dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.PORT) || 3001;
export const productServiceUrl = process.env.PRODUCT_SERVICE_URL || '';
export const reviewServiceUrl = process.env.REVIEW_SERVICE_URL || '';
