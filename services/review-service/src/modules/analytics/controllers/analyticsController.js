import * as analyticsService from '../services/analyticsService.js';

export async function productReviewStats(req, res, next) {
  try {
    res.json(await analyticsService.getProductReviewStats(req.params.productId));
  } catch (error) {
    next(error);
  }
}
