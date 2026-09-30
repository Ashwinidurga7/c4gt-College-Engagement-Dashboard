const mongoose = require('mongoose');

if (mongoose.models.PasswordResetToken) {
  module.exports = mongoose.models.PasswordResetToken;
} else {
  const passwordResetTokenSchema = new mongoose.Schema(
    {
      _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
      },
      userId: {
        type: String,
        ref: 'User',
        required: true,
        index: true,
      },
      tokenHash: {
        type: String,
        required: true,
        index: true,
      },
      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },
      usedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
      collection: 'password_reset_tokens',
    }
  );

  // TTL index to automatically purge expired records after 7 days
  passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 3600 });

  module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
}
