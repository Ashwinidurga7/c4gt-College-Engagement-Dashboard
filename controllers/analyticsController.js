const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Activity = require('../models/Activity');
const Department = require('../models/Department');

// @desc    Get dashboard high-level statistics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const totalActivities = await Activity.countDocuments();
    const pendingActivities = await Activity.countDocuments({ status: 'pending' });
    const approvedActivities = await Activity.countDocuments({ status: 'approved' });
    const rejectedActivities = await Activity.countDocuments({ status: 'rejected' });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        activities: {
          total: totalActivities,
          pending: pendingActivities,
          approved: approvedActivities,
          rejected: rejectedActivities,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get department-wise activity analytics
// @route   GET /api/analytics/departments
// @access  Private
const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const departments = await Department.find();
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const studentCount = await Student.countDocuments({ department: dept._id });
        const students = await Student.find({ department: dept._id }).select('_id');
        const studentIds = students.map((s) => s._id);

        const activityCount = await Activity.countDocuments({ student: { $in: studentIds } });
        const approvedCount = await Activity.countDocuments({
          student: { $in: studentIds },
          status: 'approved',
        });

        return {
          departmentId: dept._id,
          name: dept.name,
          code: dept.code,
          students: studentCount,
          activities: activityCount,
          approvedActivities: approvedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: departmentStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getDepartmentAnalytics,
};
