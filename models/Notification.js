const { createModel } = require('./_baseSchema');

const Notification = createModel('Notification', 'notifications', {
  recipient: { type: Object },
  recipientRole: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'general' },
  isRead: { type: Boolean, default: false },
});

module.exports = Notification;
