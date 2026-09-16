const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// @desc    Get all faculty members
// @route   GET /api/faculty
router.get('/', async (req, res, next) => {
  try {
    const faculty = await Faculty.find()
      .populate('user', 'name email avatar')
      .populate('department', 'name code');
    res.status(200).json({ success: true, count: faculty.length, data: faculty });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current logged in faculty profile
// @route   GET /api/faculty/me
router.get('/me', authorize('faculty', 'department_head'), async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id })
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single faculty member by ID
// @route   GET /api/faculty/:id
router.get('/:id', async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
});

// @desc    Create faculty profile
// @route   POST /api/faculty
router.post('/', authorize('admin', 'faculty'), async (req, res, next) => {
  try {
    const faculty = await Faculty.create({
      ...req.body,
      user: req.body.user || req.user.id,
    });
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
});

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
router.put('/:id', authorize('admin', 'faculty', 'department_head'), async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
