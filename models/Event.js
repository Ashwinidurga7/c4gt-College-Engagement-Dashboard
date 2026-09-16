const { createModel } = require('./_baseSchema');

const Event = createModel('Event', 'events', {
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  date: { type: String },
  venue: { type: String },
  organizer: { type: String },
  points: { type: Number, default: 15 },
});

module.exports = Event;
