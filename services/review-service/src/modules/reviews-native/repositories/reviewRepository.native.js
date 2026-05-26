import { ObjectId } from 'mongodb';

import { getDb } from '../../../db/mongoClient.js';

const COLLECTION = 'reviews';

function reviewsCollection() {
  return getDb().collection(COLLECTION);
}

function toObjectId(id) {
  return ObjectId.createFromHexString(String(id));
}

function serialize(doc) {
  if (!doc) {
    return null;
  }
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
  };
}

export async function findReviews({ productId, minRating, q }) {
  const filter = {};

  if (productId) {
    filter.productId = productId;
  }

  if (minRating !== undefined && minRating !== null && minRating !== '') {
    filter.rating = { $gte: Number(minRating) };
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const cursor = reviewsCollection()
    .find(filter)
    .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

  const docs = await cursor.toArray();
  return docs.map(serialize);
}

export async function insertReview(payload) {
  const now = new Date();
  const doc = {
    ...payload,
    reviewerProfileId: toObjectId(payload.reviewerProfileId),
    tags: payload.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };

  const result = await reviewsCollection().insertOne(doc);
  return serialize({ ...doc, _id: result.insertedId });
}

export async function updateReview(reviewId, updates) {
  const allowed = ['title', 'body', 'rating', 'tags'];
  const $set = { updatedAt: new Date() };

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      $set[key] = updates[key];
    }
  }

  const result = await reviewsCollection().findOneAndUpdate(
    { _id: toObjectId(reviewId) },
    { $set },
    { returnDocument: 'after' },
  );

  return serialize(result);
}

export async function deleteReview(reviewId) {
  const result = await reviewsCollection().deleteOne({ _id: new ObjectId(reviewId) });
  return result.deletedCount > 0;
}

export async function ensureReviewIndexes() {
  const collection = reviewsCollection();
  await collection.createIndex({ productId: 1, createdAt: -1 });
  await collection.createIndex({ title: 'text', body: 'text' });
}
