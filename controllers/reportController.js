const Student = require('../models/Student');
const Activity = require('../models/Activity');
const Certification = require('../models/Certification');
const Internship = require('../models/Internship');
const Achievement = require('../models/Achievement');

// @desc    Generate student comprehensive report
// @route   GET /api/reports/student/:studentId
// @access  Private
const getStudentReport = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [activities, certifications, internships, achievements] = await Promise.all([
      Activity.find({ student: student._id }).populate('category', 'name code defaultPoints'),
      Certification.find({ student: student._id }),
      Internship.find({ student: student._id }),
      Achievement.find({ student: student._id }),
    ]);

    const totalPointsEarned = activities
      .filter((a) => a.status === 'approved')
      .reduce((sum, a) => sum + (a.pointsAwarded || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        student,
        summary: {
          totalPointsEarned,
          totalActivities: activities.length,
          approvedActivities: activities.filter((a) => a.status === 'approved').length,
          certificationsCount: certifications.length,
          internshipsCount: internships.length,
          achievementsCount: achievements.length,
        },
        activities,
        certifications,
        internships,
        achievements,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate department comprehensive report
// @route   GET /api/reports/department/:departmentId
// @access  Private/Faculty/Admin
const getDepartmentReport = async (req, res, next) => {
  try {
    const students = await Student.find({ department: req.params.departmentId })
      .populate('user', 'name email');

    const studentIds = students.map((s) => s._id);
    const activities = await Activity.find({ student: { $in: studentIds } });

    res.status(200).json({
      success: true,
      data: {
        totalStudents: students.length,
        totalActivities: activities.length,
        approvedActivities: activities.filter((a) => a.status === 'approved').length,
        students,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentReport,
  getDepartmentReport,
};
