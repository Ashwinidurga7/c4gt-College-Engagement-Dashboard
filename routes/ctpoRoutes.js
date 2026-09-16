const express = require('express');
const router = express.Router();
const {
  getCtpoDashboard,
  getCtpoStudents,
  getCtpoStudentById,
  getCtpoAttendance,
  getCtpoAcademicReport,
} = require('../controllers/ctpoController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All CTPO routes require authentication and CTPO role
router.use(protect);
router.use(authorize('ctpo'));

router.get('/dashboard', getCtpoDashboard);
router.get('/students', getCtpoStudents);
router.get('/students/:id', getCtpoStudentById);
router.get('/attendance', getCtpoAttendance);
router.get('/academic-report', getCtpoAcademicReport);

module.exports = router;
