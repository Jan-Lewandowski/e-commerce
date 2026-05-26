import * as reviewService from '../services/reviewService.mongoose.js';

export async function detail(req, res, next) {
  try {
    res.json(await reviewService.getReviewDetail(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const review = await reviewService.createReviewMongoose(req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}
