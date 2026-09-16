const express = require('express');
const router = express.Router();
const { getStudentTransport, getAdminFleet, addFleetRoute } = require('../controllers/transportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student transport route
router.get('/student', protect, getStudentTransport);

// Admin transport routes
router.get('/fleet', protect, authorize('admin'), getAdminFleet);
router.get('/', protect, (req, res, next) => {
  if (req.user?.role === 'admin') {
    return getAdminFleet(req, res, next);
  }
  return getStudentTransport(req, res, next);
});
router.post('/', protect, authorize('admin'), addFleetRoute);

module.exports = router;
