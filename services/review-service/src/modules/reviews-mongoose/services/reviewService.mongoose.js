import { Review } from '../../../models/Review.js';
import { ReviewerProfile } from '../../../models/ReviewerProfile.js';
import { HttpError } from '../../../utils/httpError.js';

export async function getReviewDetail(reviewId) {
  const review = await Review.findById(reviewId).populate('reviewerProfileId');
  if (!review) {
    throw new HttpError(404, 'Nie znaleziono recenzji.');
  }
  return review;
}

export async function createReviewMongoose(body) {
  const profile = await ReviewerProfile.findById(body.reviewerProfileId);
  if (!profile) {
    throw new HttpError(404, 'Nie znaleziono profilu recenzenta.');
  }

  const review = new Review({
    productId: body.productId,
    authorEmail: body.authorEmail,
    reviewerProfileId: body.reviewerProfileId,
    rating: body.rating,
    title: body.title,
    body: body.body,
    tags: body.tags ?? [],
  });

  await review.save();
  return review.populate('reviewerProfileId');
}
