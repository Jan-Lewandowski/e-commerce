import { getRequestToken } from '../middleware/authMiddleware.js';
import * as authService from '../services/authService.js';

function setAuthCookie(res, token) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    setAuthCookie(res, result.token);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    setAuthCookie(res, result.token);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = getRequestToken(req);
    await authService.logout(token);
    res.clearCookie('auth_token', { path: '/' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json(await authService.getCurrentUser(getRequestToken(req)));
  } catch (error) {
    next(error);
  }
}
