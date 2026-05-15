import { getUserFromToken } from '../services/authService.js';
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

  return bearerToken || req.headers['x-mock-token'] || parseCookieToken(req.headers.cookie);
}

export function optionalAuth(req, _res, next) {
  const token = getRequestToken(req);
  const user = getUserFromToken(token);

  req.auth = {
    token,
    user,
  };

  next();
}

export function authenticate(req, _res, next) {
  optionalAuth(req, null, () => {
    if (!req.auth.user) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }

    next();
  });
}

export function requireAdmin(req, _res, next) {
  authenticate(req, null, (error) => {
    if (error) {
      next(error);
      return;
    }

    if (req.auth.user.role !== 'admin') {
      next(new HttpError(403, 'Admin access required'));
      return;
    }

    next();
  });
}
