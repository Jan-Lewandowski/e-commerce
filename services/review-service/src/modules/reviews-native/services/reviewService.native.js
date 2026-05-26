import * as reviewRepo from '../repositories/reviewRepository.native.js';
import { HttpError } from '../../../utils/httpError.js';

export function listReviews(query) {
  return reviewRepo.findReviews({
    productId: query.productId,
    minRating: query.minRating,
    q: query.q,
  });
}

export async function createReview(body) {
  const { productId, authorEmail, reviewerProfileId, rating, title, body: text, tags } =
    body;

  if (!productId || !authorEmail || !reviewerProfileId || !rating || !title || !text) {
    throw new HttpError(400, 'productId, authorEmail, reviewerProfileId, rating, title i body sa wymagane.');
  }

  return reviewRepo.insertReview({
    productId,
    authorEmail: authorEmail.toLowerCase(),
    reviewerProfileId: reviewerProfileId,
    rating: Number(rating),
    title,
    body: text,
    tags: tags ?? [],
  });
}

export async function updateReview(reviewId, body) {
  const updated = await reviewRepo.updateReview(reviewId, body);
  if (!updated) {
    throw new HttpError(404, 'Nie znaleziono recenzji.');
  }
  return updated;
}

export async function removeReview(reviewId) {
  const deleted = await reviewRepo.deleteReview(reviewId);
  if (!deleted) {
    throw new HttpError(404, 'Nie znaleziono recenzji.');
  }
}
