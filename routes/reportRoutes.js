const express = require('express');
const router = express.Router();
const {
  getStudentReport,
  getDepartmentReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/student/:studentId', getStudentReport);
router.get('/department/:departmentId', authorize('faculty', 'department_head', 'admin'), getDepartmentReport);

module.exports = router;
