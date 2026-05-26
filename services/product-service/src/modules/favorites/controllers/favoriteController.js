import * as favoriteService from '../services/favoriteService.js';
import { HttpError } from '../../../utils/httpError.js';

export async function list(req, res, next) {
  try {
    res.json(await favoriteService.listFavorites(req.auth.user));
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    if (!req.params.productId) throw new HttpError(400, 'Brak productId.');
    res.json(await favoriteService.addFavorite(req.auth.user, req.params.productId));
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    if (!req.params.productId) throw new HttpError(400, 'Brak productId.');
    res.json(await favoriteService.removeFavorite(req.auth.user, req.params.productId));
  } catch (err) {
    next(err);
  }
}

export async function clear(req, res, next) {
  try {
    res.json(await favoriteService.clearFavorites(req.auth.user));
  } catch (err) {
    next(err);
  }
}
