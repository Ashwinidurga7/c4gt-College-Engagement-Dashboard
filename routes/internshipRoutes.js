const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// @desc    Get internships
// @route   GET /api/internships
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    let internships = await Internship.find();

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile) return res.status(200).json({ success: true, count: 0, data: [] });
      internships = internships.filter((i) => String(i.student) === String(studentProfile._id));
    } else if (req.query.studentId) {
      internships = internships.filter((i) => String(i.student) === String(req.query.studentId));
    }

    res.status(200).json({ success: true, count: internships.length, data: internships });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit new internship
// @route   POST /api/internships
// @access  Private (Student)
router.post('/', authorize('student'), async (req, res, next) => {
  try {
    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { companyName, role, mode, startDate, endDate, stipend, description } = req.body;
    if (!companyName || !role) {
      return res.status(400).json({ success: false, message: 'companyName and role are required' });
    }

    const newInternship = await Internship.create({
      student: studentProfile._id,
      companyName,
      role,
      mode: mode || 'remote',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      stipend: stipend ? Number(stipend) : 0,
      description: description || '',
      status: 'pending',
    });

    res.status(201).json({ success: true, data: newInternship });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Private (Owner Student, Admin)
router.delete('/:id', async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile || String(internship.student) !== String(studentProfile._id)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this internship' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the owning student or an admin can delete this internship' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
