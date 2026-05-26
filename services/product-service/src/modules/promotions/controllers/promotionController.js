import * as promotionService from '../services/promotionService.js';
import { HttpError } from '../../../utils/httpError.js';

export async function list(_req, res, next) {
  try {
    res.json(await promotionService.listPromotions());
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new HttpError(400, 'Nieprawidlowe id.');
    const promo = await promotionService.getPromotionById(id);
    if (!promo) throw new HttpError(404, 'Nie znaleziono promocji.');
    res.json(promo);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { code, description, percentOff, startsAt, endsAt, productIds } = req.body || {};
    if (!code || !description || percentOff === undefined || !startsAt || !endsAt) {
      throw new HttpError(400, 'code, description, percentOff, startsAt, endsAt sa wymagane.');
    }
    const promo = await promotionService.createPromotion({
      code,
      description,
      percentOff,
      startsAt,
      endsAt,
      productIds: Array.isArray(productIds) ? productIds : [],
    });
    res.status(201).json(promo);
  } catch (err) {
    if (err && err.code === 'P2002') {
      return next(new HttpError(409, 'Kod promocji juz istnieje.'));
    }
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new HttpError(400, 'Nieprawidlowe id.');
    await promotionService.deletePromotion(id);
    res.status(204).send();
  } catch (err) {
    if (err && err.code === 'P2025') {
      return next(new HttpError(404, 'Nie znaleziono promocji.'));
    }
    next(err);
  }
}

export async function activeNow(req, res, next) {
  try {
    const date = req.query.date ? new Date(String(req.query.date)) : new Date();
    if (Number.isNaN(date.getTime())) throw new HttpError(400, 'Nieprawidlowa data.');
    res.json(await promotionService.activePromotionsAt(date));
  } catch (err) {
    next(err);
  }
}
