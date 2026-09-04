const express = require('express');
const router = express.Router();
const {
  verifyActivity,
  getVerificationsByActivity,
} = require('../controllers/verificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/:activityId', authorize('faculty', 'department_head', 'admin'), verifyActivity);
router.get('/activity/:activityId', getVerificationsByActivity);

module.exports = router;
