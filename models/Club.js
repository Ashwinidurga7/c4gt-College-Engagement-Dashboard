const { createModel } = require('./_baseSchema');

const Club = createModel('Club', 'clubs', {
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  lead: { type: String },
  membersCount: { type: Number, default: 0 },
});

module.exports = Club;
