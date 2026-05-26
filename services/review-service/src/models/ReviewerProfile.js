import mongoose from 'mongoose';

const bannedPattern = /spam|fake|bot/i;

const reviewerProfileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          if (typeof value !== 'string' || value.trim().length < 2) {
            return false;
          }
          return !bannedPattern.test(value);
        },
        message: 'Nazwa wyswietlana jest nieprawidlowa (min. 2 znaki, bez spam/fake/bot).',
      },
    },
    verifiedPurchaser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'reviewer_profiles',
  },
);

reviewerProfileSchema.statics.findByEmail = function findByEmail(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

export const ReviewerProfile =
  mongoose.models.ReviewerProfile ||
  mongoose.model('ReviewerProfile', reviewerProfileSchema);
