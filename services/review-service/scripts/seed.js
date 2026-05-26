// idempotenty seed
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mongodbUri } from '../src/config/env.js';
import { connectMongo, closeMongo } from '../src/db/mongoClient.js';
import { connectMongoose, disconnectMongoose } from '../src/db/mongoose.js';
import { ensureReviewIndexes } from '../src/modules/reviews-native/repositories/reviewRepository.native.js';
import { ReviewerProfile } from '../src/models/ReviewerProfile.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = join(__dirname, '..', 'data', 'reviews-seed.json');
const seedData = JSON.parse(readFileSync(seedPath, 'utf8'));

async function seed() {
  await connectMongo(mongodbUri);
  await connectMongoose(mongodbUri);
  await ensureReviewIndexes();

  const profileCount = await ReviewerProfile.countDocuments();
  if (profileCount > 0) {
    console.log('[seed] reviewer_profiles already populated — skipping.');
    return;
  }

  console.log('[seed] inserting reviewer profiles and reviews...');

  const profileIdByEmail = new Map();

  for (const profile of seedData.reviewerProfiles) {
    const created = await ReviewerProfile.create(profile);
    profileIdByEmail.set(profile.email.toLowerCase(), created._id);
  }

  const db = (await import('../src/db/mongoClient.js')).getDb();
  const reviews = seedData.reviews.map((review) => {
    const profileId = profileIdByEmail.get(review.profileEmail.toLowerCase());
    const now = new Date();

    return {
      productId: review.productId,
      authorEmail: review.authorEmail.toLowerCase(),
      reviewerProfileId: profileId,
      rating: review.rating,
      title: review.title,
      body: review.body,
      tags: review.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
  });

  await db.collection('reviews').insertMany(reviews);
  console.log(`[seed] inserted ${seedData.reviewerProfiles.length} profiles and ${reviews.length} reviews.`);
}

seed()
  .catch((error) => {
    console.error('[seed] failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectMongoose();
    await closeMongo();
  });
