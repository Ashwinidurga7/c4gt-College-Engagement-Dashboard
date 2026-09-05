const Verification = require('../models/Verification');
const Activity = require('../models/Activity');
const Faculty = require('../models/Faculty');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

// @desc    Verify or reject an activity
// @route   POST /api/verification/:activityId
// @access  Private/Faculty/Admin
const verifyActivity = async (req, res, next) => {
  try {
    const { status, remarks, pointsGranted } = req.body;

    const activity = await Activity.findById(req.params.activityId).populate('student');
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    let facultyProfile = await Faculty.findOne({ user: req.user.id });
    const verifierId = facultyProfile ? facultyProfile._id : req.user.id;

    // Create verification log
    const verification = await Verification.create({
      activity: activity._id,
      verifiedBy: verifierId,
      status,
      remarks: remarks || '',
      pointsGranted: status === 'approved' ? pointsGranted || activity.pointsRequested : 0,
    });

    // Update activity status
    activity.status = status;
    if (status === 'approved') {
      activity.pointsAwarded = pointsGranted || activity.pointsRequested;
    } else {
      activity.rejectionReason = remarks || '';
    }
    await activity.save();

    // Notify student
    if (activity.student && activity.student.user) {
      await Notification.create({
        recipient: activity.student.user,
        title: `Activity ${status.toUpperCase()}`,
        message: `Your activity "${activity.title}" has been ${status}.`,
        type: 'verification',
      });
    }

    res.status(200).json({
      success: true,
      message: `Activity marked as ${status}`,
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get verifications history for an activity
// @route   GET /api/verification/activity/:activityId
// @access  Private
const getVerificationsByActivity = async (req, res, next) => {
  try {
    const verifications = await Verification.find({ activity: req.params.activityId })
      .populate({
        path: 'verifiedBy',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: verifications.length, data: verifications });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyActivity,
  getVerificationsByActivity,
};
