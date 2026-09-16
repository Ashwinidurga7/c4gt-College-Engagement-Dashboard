const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDepartmentAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/departments', authorize('faculty', 'department_head', 'admin'), getDepartmentAnalytics);

module.exports = router;
