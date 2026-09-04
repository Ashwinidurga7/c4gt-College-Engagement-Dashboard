const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Achievement = require('../models/Achievement');
const Internship = require('../models/Internship');
const Certification = require('../models/Certification');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// @desc    Get all students
// @route   GET /api/students
router.get('/', authorize('admin', 'faculty', 'department_head'), async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email avatar')
      .populate('department', 'name code');
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current student's profile
// @route   GET /api/students/me
router.get('/me', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Create student profile
// @route   POST /api/students
router.post('/', async (req, res, next) => {
  try {
    const existing = await Student.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Student profile already exists' });
    }

    const student = await Student.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Update student profile
// @route   PUT /api/students/:id
router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// Student Achievements
router.get('/:id/achievements', async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ student: req.params.id });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
});

// Student Internships
router.get('/:id/internships', async (req, res, next) => {
  try {
    const internships = await Internship.find({ student: req.params.id });
    res.status(200).json({ success: true, count: internships.length, data: internships });
  } catch (error) {
    next(error);
  }
});

// Student Certifications
router.get('/:id/certifications', async (req, res, next) => {
  try {
    const certifications = await Certification.find({ student: req.params.id });
    res.status(200).json({ success: true, count: certifications.length, data: certifications });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
