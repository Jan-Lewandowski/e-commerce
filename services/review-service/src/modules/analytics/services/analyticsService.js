import { getDb } from '../../../db/mongoClient.js';

export async function getProductReviewStats(productId) {
  const pipeline = [
    { $match: { productId } },
    {
      $lookup: {
        from: 'reviewer_profiles',
        localField: 'reviewerProfileId',
        foreignField: '_id',
        as: 'profile',
      },
    },
    {
      $unwind: {
        path: '$profile',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$productId',
        reviewCount: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        verifiedCount: {
          $sum: {
            $cond: [{ $eq: ['$profile.verifiedPurchaser', true] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        reviewCount: 1,
        avgRating: { $round: ['$avgRating', 2] },
        verifiedCount: 1,
      },
    },
    { $sort: { avgRating: -1 } },
  ];

  const [stats] = await getDb().collection('reviews').aggregate(pipeline).toArray();

  return (
    stats ?? {
      productId,
      reviewCount: 0,
      avgRating: 0,
      verifiedCount: 0,
    }
  );
}
