import * as authService from '../services/authService.js';
import { getRequestToken } from '../middleware/authMiddleware.js';

function setAuthCookie(res, token) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
  });
}

export function register(req, res) {
  const result = authService.register(req.body);
  setAuthCookie(res, result.token);
  res.status(201).json(result);
}

export function login(req, res) {
  const result = authService.login(req.body);
  setAuthCookie(res, result.token);
  res.json(result);
}

export function logout(req, res) {
  const token = getRequestToken(req);
  authService.logout(token);
  res.clearCookie('auth_token');
  res.status(204).send();
}

export function getMe(req, res) {
  res.json(authService.getCurrentUser(getRequestToken(req)));
}
