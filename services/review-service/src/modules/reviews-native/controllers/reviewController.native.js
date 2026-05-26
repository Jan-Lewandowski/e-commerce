import * as reviewService from '../services/reviewService.native.js';

export async function list(req, res, next) {
  try {
    res.json(await reviewService.listReviews(req.query));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    res.json(await reviewService.updateReview(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await reviewService.removeReview(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
