const { createModel } = require('./_baseSchema');

const Activity = createModel('Activity', 'activities', {
  student: { type: Object },
  title: { type: String, required: true },
  category: { type: String },
  points: { type: Number, default: 10 },
  status: { type: String, enum: ['pending', 'approved', 'verified', 'rejected'], default: 'pending' },
  verificationMeta: { type: Object },
  date: { type: Date, default: Date.now },
});

module.exports = Activity;
