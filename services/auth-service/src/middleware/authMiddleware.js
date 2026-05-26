import { getUserFromToken as resolveUserFromToken } from '../services/authService.js';
import { HttpError } from '../utils/httpError.js';

function parseCookieToken(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('auth_token='))
    ?.split('=')
    .slice(1)
    .join('=');
}

export function getRequestToken(req) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  return bearerToken || req.headers['x-auth-token'] || parseCookieToken(req.headers.cookie);
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = getRequestToken(req);
    const user = await resolveUserFromToken(token);

    req.auth = {
      token,
      user,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export async function authenticate(req, _res, next) {
  try {
    const token = getRequestToken(req);
    const user = await resolveUserFromToken(token);

    req.auth = { token, user };

    if (!user) {
      throw new HttpError(401, 'Unauthorized');
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function requireAdmin(req, _res, next) {
  try {
    const token = getRequestToken(req);
    const user = await resolveUserFromToken(token);

    req.auth = { token, user };

    if (!user) {
      throw new HttpError(401, 'Unauthorized');
    }

    if (user.role !== 'admin') {
      throw new HttpError(403, 'Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
}
