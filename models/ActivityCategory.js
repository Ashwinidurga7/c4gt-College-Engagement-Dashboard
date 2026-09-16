const { createModel } = require('./_baseSchema');

const ActivityCategory = createModel('ActivityCategory', 'activitycategories', {
  name: { type: String, required: true },
  code: { type: String, required: true },
  maxPoints: { type: Number, default: 50 },
  description: { type: String },
});

module.exports = ActivityCategory;
