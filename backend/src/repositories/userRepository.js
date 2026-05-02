import { randomUUID } from 'node:crypto';

import { sessions, users } from '../../data.js';

export function createUser({ username, email, password = '', role = 'user' }) {
  const user = {
    id: randomUUID(),
    username,
    email,
    password,
    role,
  };

  users.push(user);
  return user;
}

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserByUsername(username) {
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null;
}

export function findUserById(userId) {
  return users.find((user) => user.id === userId) || null;
}

export function updateUser(userId, updates) {
  const user = findUserById(userId);

  if (!user) {
    return null;
  }

  Object.assign(user, updates);
  return user;
}

export function createSession(userId) {
  const session = {
    token: randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };

  sessions.push(session);
  return session;
}

export function findSessionByToken(token) {
  return sessions.find((session) => session.token === token) || null;
}

export function deleteSession(token) {
  const index = sessions.findIndex((session) => session.token === token);

  if (index === -1) {
    return false;
  }

  sessions.splice(index, 1);
  return true;
}
