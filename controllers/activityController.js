const Activity = require('../models/Activity');
const Student = require('../models/Student');
const Evidence = require('../models/Evidence');
const notificationService = require('../services/notificationService');

// @desc    Get all activities (or student's own activities)
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    let query = {};

    // If student, only view own activities
    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      query.student = studentProfile._id;
    } else if (req.query.studentId) {
      query.student = req.query.studentId;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const activities = await Activity.find(query)
      .populate('category', 'name code defaultPoints')
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
// @access  Private
const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('category', 'name code defaultPoints')
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const evidences = await Evidence.find({ activity: activity._id });

    res.status(200).json({
      success: true,
      data: {
        ...activity.toObject(),
        evidences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private/Student
const createActivity = async (req, res, next) => {
  try {
    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(400).json({ success: false, message: 'Student profile required before submitting activities' });
    }

    const activity = await Activity.create({
      ...req.body,
      student: studentProfile._id,
      status: 'pending',
    });

    // Safely notify responsible faculty
    try {
      await notificationService.sendApprovalRequestNotification({
        studentProfile,
        studentName: req.user.name || 'Student',
        itemType: 'ACTIVITY',
        itemTitle: activity.title,
        itemId: activity._id,
      });
    } catch (notifErr) {
      console.error('Failed to notify faculty for activity submission:', notifErr.message);
    }

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res, next) => {
  try {
    let activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Only allow editing if pending or resubmit
    if (activity.status === 'approved' && req.user.role === 'student') {
      return res.status(400).json({ success: false, message: 'Approved activities cannot be modified' });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      const activityStudentId = activity.student?._id || activity.student?.id || activity.student;
      if (!studentProfile || String(activityStudentId) !== String(studentProfile._id)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this activity' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the activity owner or an admin can delete this activity' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    await Evidence.deleteMany({ activity: req.params.id });

    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
