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

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(authorize('admin', 'faculty', 'department_head'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(authorize('admin'), updateEvent)
  .delete(authorize('admin'), deleteEvent);

module.exports = router;
