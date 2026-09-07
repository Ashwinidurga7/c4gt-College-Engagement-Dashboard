const Verification = require('../models/Verification');
const Activity = require('../models/Activity');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const notificationService = require('../services/notificationService');

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

    if (req.user.role === 'faculty') {
      if (!facultyProfile || !notificationService.isFacultyApprovedAndActive(facultyProfile)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Faculty account is pending approval or inactive',
        });
      }

      const studentRec = activity.student && activity.student._id ? activity.student : await Student.findById(activity.student);
      if (!studentRec) {
        return res.status(404).json({ success: false, message: 'Associated student not found' });
      }

      const deptMatches = notificationService.doesDepartmentMatch(facultyProfile.department, studentRec.department);
      const yearMatches = notificationService.isFacultyAssignedToYear(
        facultyProfile,
        studentRec.year || notificationService.getStudentYear(studentRec)
      );

      if (!deptMatches || !yearMatches) {
        return res.status(403).json({
          success: false,
          message:
            'Forbidden: You can only verify activities for students in your assigned department and academic year',
        });
      }
    }

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

    // Notify student via centralized notification service
    try {
      let studentUserId = null;
      if (activity.student) {
        if (activity.student.user) {
          studentUserId = activity.student.user._id || activity.student.user.id || activity.student.user;
        } else {
          const studentRec = await Student.findById(activity.student);
          if (studentRec && studentRec.user) {
            studentUserId = studentRec.user._id || studentRec.user.id || studentRec.user;
          }
        }
      }

      if (studentUserId) {
        await notificationService.sendApprovalResponseNotification({
          studentUserId,
          itemType: 'ACTIVITY',
          itemTitle: activity.title,
          itemId: activity._id,
          status,
          remarks: remarks || '',
        });
      }
    } catch (notifErr) {
      console.error('Failed to notify student of verification result:', notifErr.message);
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
