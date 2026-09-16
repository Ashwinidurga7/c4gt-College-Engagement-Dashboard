const express = require('express');
const router = express.Router();
const { getStudentFees, payStudentFees } = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');

// Student Fee Endpoints
router.get('/', protect, getStudentFees);
router.post('/pay', protect, payStudentFees);

module.exports = router;
