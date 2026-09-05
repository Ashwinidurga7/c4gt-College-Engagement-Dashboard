const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getCourseStudents,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getCourses)
  .post(authorize('admin', 'faculty'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(authorize('admin', 'faculty'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

router.route('/:id/enroll')
  .post(authorize('student'), enrollCourse);

router.route('/:id/students')
  .get(authorize('faculty', 'admin', 'department_head'), getCourseStudents);

module.exports = router;
