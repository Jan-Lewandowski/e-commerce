import { HttpError } from '../utils/httpError.js';
import { authInternalUrl } from '../config/env.js';

const CACHE_TTL_MS = 15_000;
const cache = new Map();

function parseCookieToken(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('auth_token='))
    ?.split('=')
    .slice(1)
    .join('=');
}

function getRequestToken(req) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return bearerToken || parseCookieToken(req.headers.cookie);
}

function getCachedUser(token) {
  const entry = cache.get(token);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cache.delete(token);
    return null;
  }
  return entry.user;
}

function setCachedUser(token, user) {
  cache.set(token, { user, cachedAt: Date.now() });
}

async function validateWithAuthService(token) {
  const cached = getCachedUser(token);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${authInternalUrl}/internal/validate`, {
    headers: { 'X-Auth-Token': token },
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();
  setCachedUser(token, user);
  return user;
}

export async function requireAuth(req, _res, next) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      throw new HttpError(401, 'Brak autoryzacji.');
    }

    const user = await validateWithAuthService(token);
    if (!user) {
      throw new HttpError(401, 'Brak autoryzacji.');
    }

    req.auth = { user };
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireAdmin(req, _res, next) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      throw new HttpError(401, 'Brak autoryzacji.');
    }

    const user = await validateWithAuthService(token);
    if (!user) {
      throw new HttpError(401, 'Brak autoryzacji.');
    }

    if (user.role !== 'admin') {
      throw new HttpError(403, 'Wymagana rola admin.');
    }

    req.auth = { user };
    next();
  } catch (error) {
    next(error);
  }
}
