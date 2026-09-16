const { createModel } = require('./_baseSchema');

const Achievement = createModel('Achievement', 'achievements', {
  student: { type: Object },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  date: { type: Date },
  badge: { type: String },
});

module.exports = Achievement;
