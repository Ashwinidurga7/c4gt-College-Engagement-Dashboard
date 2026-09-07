const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// @desc    Get current user's notifications
// @route   GET /api/notifications
router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
});

// @desc    Get unread notifications for current user
// @route   GET /api/notifications/unread
router.get('/unread', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id, isRead: false })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
router.put('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await Notification.findOne({ _id: req.params.id, recipient: req.user.id });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (typeof Notification.findOneAndDelete === 'function') {
      await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    } else {
      await Notification.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
