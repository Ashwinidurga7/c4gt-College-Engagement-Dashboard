const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('admin'), createAnnouncement);

router.route('/:id')
  .put(authorize('admin'), updateAnnouncement)
  .delete(authorize('admin'), deleteAnnouncement);

module.exports = router;
