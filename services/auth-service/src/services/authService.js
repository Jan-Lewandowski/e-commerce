import * as userRepository from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';
import bcrypt from 'bcryptjs';

export function publicUser(user) {
  if (!user) {
    return null;
  }

  const { password, zip_code: zipCode, ...safeUser } = user;
  return { ...safeUser, zipCode };
}

function cleanProfileValue(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned || null;
}

export async function register({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, 'E-mail i hasło są wymagane.');
  }

  if (await userRepository.findUserByEmail(email)) {
    throw new HttpError(409, 'Ten adres e-mail jest już zarejestrowany.');
  }

  const role = 'user';
  const hashed = bcrypt.hashSync(password, 8);
  const user = await userRepository.createUser({ email, password: hashed, role });
  const session = await userRepository.createSession(user.id);

  return {
    token: session.token,
    user: publicUser(user),
  };
}

export async function login({ email, password }) {
  if (!email) {
    throw new HttpError(400, 'E-mail jest wymagany.');
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError(404, 'Nie znaleziono użytkownika.');
  }

  if (user.password && !bcrypt.compareSync(password, user.password)) {
    throw new HttpError(401, 'Nieprawidłowe dane logowania.');
  }

  const session = await userRepository.createSession(user.id);

  return {
    token: session.token,
    user: publicUser(user),
  };
}

export async function logout(token) {
  if (!token) {
    return false;
  }

  return userRepository.deleteSession(token);
}

export async function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  const session = await userRepository.findSessionByToken(token);

  if (!session) {
    return null;
  }

  return userRepository.findUserById(session.user_id);
}

export async function getCurrentUser(token) {
  const user = await getUserFromToken(token);

  if (!user) {
    throw new HttpError(401, 'Brak autoryzacji.');
  }

  return publicUser(user);
}



export async function updateCurrentUserProfile(userId, payload = {}) {
  const profile = {
    name: cleanProfileValue(payload.name),
    phone: cleanProfileValue(payload.phone),
    street: cleanProfileValue(payload.street),
    city: cleanProfileValue(payload.city),
    zipCode: cleanProfileValue(payload.zipCode),
  };

  const user = await userRepository.updateUserProfile(userId, profile);

  if (!user) {
    throw new HttpError(404, 'Nie znaleziono uĹĽytkownika.');
  }

  return publicUser(user);
}
