const { createModel } = require('./_baseSchema');

// Campus announcements shown on the student dashboard; published by admins.
const Announcement = createModel('Announcement', 'announcements', {
  title: { type: String, required: true, trim: true },
  body: { type: String, default: '' },
  category: { type: String, default: 'General' },
  date: { type: String },
  createdBy: { type: String },
});

module.exports = Announcement;
