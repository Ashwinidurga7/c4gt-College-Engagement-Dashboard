const express = require('express');
const router = express.Router();
const {
  getHodDashboard,
  getHodStudents,
  getHodStudentById,
  getHodAttendance,
  getHodAcademicReport,
  getHodReports,
  getPendingCtpos,
  approveCtpo,
  rejectCtpo,
} = require('../controllers/hodController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All HOD routes require authentication and HOD role
router.use(protect);
router.use(authorize('hod'));

router.get('/dashboard', getHodDashboard);
router.get('/students', getHodStudents);
router.get('/students/:id', getHodStudentById);
router.get('/attendance', getHodAttendance);
router.get('/academic-report', getHodAcademicReport);
router.get('/reports', getHodReports);

// CTPO Approval Workflow for this HOD
router.get('/ctpos/pending', getPendingCtpos);
router.put('/ctpos/:id/approve', approveCtpo);
router.put('/ctpos/:id/reject', rejectCtpo);

module.exports = router;
