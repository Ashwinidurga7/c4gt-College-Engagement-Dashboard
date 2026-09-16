const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// @desc    Get achievements
// @route   GET /api/achievements
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    let achievements = await Achievement.find();

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile) return res.status(200).json({ success: true, count: 0, data: [] });
      achievements = achievements.filter((a) => String(a.student) === String(studentProfile._id));
    } else if (req.query.studentId) {
      achievements = achievements.filter((a) => String(a.student) === String(req.query.studentId));
    }

    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit new achievement
// @route   POST /api/achievements
// @access  Private (Student)
router.post('/', authorize('student'), async (req, res, next) => {
  try {
    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { title, category, level, position, date, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Achievement title is required' });
    }

    const newAchievement = await Achievement.create({
      student: studentProfile._id,
      title,
      category: category || 'General',
      level: level || 'College',
      position: position || 'Participant',
      date: date ? new Date(date) : new Date(),
      description: description || '',
    });

    res.status(201).json({ success: true, data: newAchievement });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Owner Student, Admin)
router.delete('/:id', async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile || String(achievement.student) !== String(studentProfile._id)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this achievement' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the owning student or an admin can delete this achievement' });
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
