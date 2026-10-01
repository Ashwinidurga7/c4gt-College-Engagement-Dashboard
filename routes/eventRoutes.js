const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { acceptPhotos } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(authorize('admin', 'faculty', 'department_head'), acceptPhotos, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(authorize('admin'), acceptPhotos, updateEvent)
  .delete(authorize('admin'), deleteEvent);

module.exports = router;
