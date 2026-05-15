import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf8'));

export const categories = catalog.categories;
export const products = catalog.products;

export const users = [
  {
    id: 'usr-admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password', 8),
    role: 'admin',
  },
];

export const sessions = [];
export const orders = [];
