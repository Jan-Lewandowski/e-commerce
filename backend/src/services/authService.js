import * as userRepository from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';

function publicUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export function register({ username, email, password }) {
  if (!username || !email) {
    throw new HttpError(400, 'Username and email are required');
  }

  if (userRepository.findUserByEmail(email)) {
    throw new HttpError(409, 'User with this email already exists');
  }

  const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';
  const user = userRepository.createUser({ username, email, password, role });
  const session = userRepository.createSession(user.id);

  return {
    token: session.token,
    user: publicUser(user),
  };
}

export function login({ username, email, password }) {
  const loginValue = email || username;

  if (!loginValue) {
    throw new HttpError(400, 'Email or username is required');
  }

  const user = userRepository.findUserByEmail(loginValue)
    || userRepository.findUserByUsername(loginValue);

  if (!user || (user.password && user.password !== password)) {
    throw new HttpError(401, 'Invalid login credentials');
  }

  const session = userRepository.createSession(user.id);

  return {
    token: session.token,
    user: publicUser(user),
  };
}

export function logout(token) {
  if (!token) {
    return false;
  }

  return userRepository.deleteSession(token);
}

export function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const session = userRepository.findSessionByToken(token);

  if (!session) {
    return null;
  }

  return userRepository.findUserById(session.userId);
}

export function getCurrentUser(token) {
  const user = getUserFromToken(token);

  if (!user) {
    throw new HttpError(401, 'Unauthorized');
  }

  return publicUser(user);
}

export function updateCurrentUser(userId, { username, email }) {
  if (!username || !email) {
    throw new HttpError(400, 'Username and email are required');
  }

  const existingUser = userRepository.findUserByEmail(email);

  if (existingUser && existingUser.id !== userId) {
    throw new HttpError(409, 'User with this email already exists');
  }

  const user = userRepository.updateUser(userId, { username, email });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return publicUser(user);
}
