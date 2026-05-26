import { randomUUID } from 'node:crypto';

import db from '../db/knex.js';

export async function createUser({ email, password = '', role = 'user' }) {
  const user = {
    id: randomUUID(),
    email,
    password,
    role,
  };

  const [created] = await db('users').insert(user).returning('*');
  return created;
}

export async function findUserByEmail(email) {
  return (
    (await db('users').whereRaw('LOWER(email) = LOWER(?)', [email]).first()) || null
  );
}

export async function findUserById(userId) {
  return (await db('users').where({ id: userId }).first()) || null;
}

export async function updateUserProfile(userId, profile) {
  const updates = {
    name: profile.name,
    phone: profile.phone,
    street: profile.street,
    city: profile.city,
    zip_code: profile.zipCode,
  };

  const [updated] = await db('users').where({ id: userId }).update(updates).returning('*');
  return updated || null;
}

export async function createSession(userId) {
  const session = {
    token: randomUUID(),
    user_id: userId,
  };

  const [created] = await db('sessions').insert(session).returning('*');
  return created;
}

export async function findSessionByToken(token) {
  return (await db('sessions').where({ token }).first()) || null;
}

export async function deleteSession(token) {
  const deleted = await db('sessions').where({ token }).del();
  return deleted > 0;
}
