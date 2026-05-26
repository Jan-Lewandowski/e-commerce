import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

export async function seed(knex) {
  const existing = await knex('users').where({ email: 'admin@example.com' }).first();
  if (existing) {
    return;
  }

  await knex('users').insert({
    id: randomUUID(),
    email: 'admin@example.com',
    password: bcrypt.hashSync('password', 8),
    role: 'admin',
  });
}
