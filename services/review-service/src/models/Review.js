import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    authorEmail: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReviewerProfile',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      validate: {
        validator(value) {
          return Number.isInteger(value) && value >= 1 && value <= 5;
        },
        message: 'Ocena musi byc liczba calkowita od 1 do 5.',
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Tytul musi miec co najmniej 3 znaki.'],
    },
    body: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return typeof value === 'string' && value.trim().length >= 10;
        },
        message: 'Tresc opinii musi miec co najmniej 10 znakow.',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'reviews',
  },
);

reviewSchema.pre('save', function normalizeReview(next) {
  if (this.authorEmail) {
    this.authorEmail = this.authorEmail.toLowerCase().trim();
  }
  this.updatedAt = new Date();
  next();
});

reviewSchema.statics.findByProduct = function findByProduct(productId) {
  return this.find({ productId }).sort({ createdAt: -1 });
};

export const Review =
  mongoose.models.Review || mongoose.model('Review', reviewSchema);
