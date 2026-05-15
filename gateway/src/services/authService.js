import * as userRepository from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';
import bcrypt from 'bcryptjs';

function publicUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export function register({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, 'E-mail i hasło są wymagane.');
  }

  if (userRepository.findUserByEmail(email)) {
    throw new HttpError(409, 'Ten adres e-mail jest już zarejestrowany.');
  }
  const role = 'user';
  const hashed = bcrypt.hashSync(password, 8);
  const user = userRepository.createUser({ email, password: hashed, role });
  const session = userRepository.createSession(user.id);

  return {
    token: session.token,
    user: publicUser(user),
  };
}

export function login({ email, password }) {
  if (!email) {
    throw new HttpError(400, 'E-mail jest wymagany.');
  }

  const user = userRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError(404, 'Nie znaleziono użytkownika.')
  }

  if (user.password && !bcrypt.compareSync(password, user.password)) {
    throw new HttpError(401, 'Nieprawidłowe dane logowania.');
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
    throw new HttpError(401, 'Brak autoryzacji.');
  }

  return publicUser(user);
}

export function updateCurrentUser(userId, { email, password }) {
  if (!email) {
    throw new HttpError(400, 'E-mail jest wymagany.');
  }

  const existingUser = userRepository.findUserByEmail(email);

  if (existingUser && existingUser.id !== userId) {
    throw new HttpError(409, 'Konto z tym adresem e-mail już istnieje.');
  }

  const updates = { email };
  if (password) {
    updates.password = bcrypt.hashSync(password, 8);
  }

  const user = userRepository.updateUser(userId, updates);

  if (!user) {
    throw new HttpError(404, 'Nie znaleziono użytkownika.');
  }

  return publicUser(user);
}
