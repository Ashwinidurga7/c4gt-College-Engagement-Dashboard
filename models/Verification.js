const { createModel } = require('./_baseSchema');

const Verification = createModel('Verification', 'verifications', {
  activity: { type: Object },
  verifiedBy: { type: Object },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  remarks: { type: String },
  verifiedAt: { type: Date },
});

module.exports = Verification;
