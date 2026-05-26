import * as cartService from '../services/cartService.js';
import { HttpError } from '../../../utils/httpError.js';

export async function list(req, res, next) {
  try {
    res.json(await cartService.listCart(req.auth.user));
  } catch (err) {
    next(err);
  }
}

export async function setQuantity(req, res, next) {
  try {
    const quantity = Number(req.body?.quantity);
    if (!req.params.productId) throw new HttpError(400, 'Brak productId.');
    res.json(await cartService.setQuantity(req.auth.user, req.params.productId, quantity));
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    if (!req.params.productId) throw new HttpError(400, 'Brak productId.');
    res.json(await cartService.removeItem(req.auth.user, req.params.productId));
  } catch (err) {
    next(err);
  }
}

export async function clear(req, res, next) {
  try {
    res.json(await cartService.clearCart(req.auth.user));
  } catch (err) {
    next(err);
  }
}
