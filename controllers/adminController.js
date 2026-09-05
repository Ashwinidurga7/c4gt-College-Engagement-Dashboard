const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Activity = require('../models/Activity');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const Department = require('../models/Department');
const { mockSystemSettings } = require('../utils/mockData');

// In-memory reference for dynamic system settings
let currentSettings = { ...mockSystemSettings };

// @desc    Get comprehensive admin dashboard analytics and counts
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const users = await User.find();
    const students = await Student.find();
    const faculty = await Faculty.find();
    const courses = await Course.find();
    const activities = await Activity.find();
    const certificates = await Certificate.find();
    const projects = await Project.find();
    const departments = await Department.find();

    const activityStats = {
      total: activities.length,
      pending: activities.filter((a) => a.status === 'pending').length,
      approved: activities.filter((a) => a.status === 'approved').length,
      rejected: activities.filter((a) => a.status === 'rejected').length,
    };

    const certificateStats = {
      total: certificates.length,
      pending: certificates.filter((c) => c.status === 'pending').length,
      verified: certificates.filter((c) => c.status === 'verified').length,
      rejected: certificates.filter((c) => c.status === 'rejected').length,
    };

    const userRoles = {
      total: users.length,
      admins: users.filter((u) => u.role === 'admin').length,
      faculty: users.filter((u) => u.role === 'faculty').length,
      students: users.filter((u) => u.role === 'student').length,
      active: users.filter((u) => u.isActive !== false).length,
    };

    res.status(200).json({
      success: true,
      data: {
        users: userRoles,
        studentsCount: students.length,
        facultyCount: faculty.length,
        departmentsCount: departments.length,
        coursesCount: courses.length,
        projectsCount: projects.length,
        activities: activityStats,
        certificates: certificateStats,
        systemStatus: {
          uptime: process.uptime(),
          serverTime: new Date(),
          environment: process.env.NODE_ENV || 'development',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;
    let users = await User.find().select('-password');

    if (role) {
      users = users.filter((u) => u.role === role);
    }
    if (status) {
      const isActiveBool = status === 'active';
      users = users.filter((u) => (u.isActive !== false) === isActiveBool);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'faculty', 'student', 'department_head'];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}`,
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStatus = typeof req.body.isActive === 'boolean' ? req.body.isActive : !user.isActive;
    const updated = await User.findByIdAndUpdate(req.params.id, { isActive: newStatus }, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      message: `User account has been ${newStatus ? 'activated' : 'deactivated'}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending verifications (activities and certificates)
// @route   GET /api/admin/pending
// @access  Private (Admin)
const getPendingVerifications = async (req, res, next) => {
  try {
    const activities = await Activity.find({ status: 'pending' });
    const certificates = await Certificate.find({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        totalPending: activities.length + certificates.length,
        activities,
        certificates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Batch approve or reject activities
// @route   POST /api/admin/activities/batch-approve
// @access  Private (Admin)
const batchApproveActivities = async (req, res, next) => {
  try {
    const { activityIds, action, pointsAwarded, remarks } = req.body;

    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      return res.status(400).json({ success: false, message: 'activityIds array is required' });
    }

    const status = action === 'reject' ? 'rejected' : 'approved';
    let updatedCount = 0;

    for (const id of activityIds) {
      const act = await Activity.findById(id);
      if (act) {
        const awarded = status === 'approved' ? (pointsAwarded !== undefined ? Number(pointsAwarded) : (act.pointsRequested || 10)) : 0;
        await Activity.findByIdAndUpdate(id, {
          status,
          pointsAwarded: awarded,
          remarks: remarks || `Batch processed: ${status}`,
        });
        updatedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} activities to ${status}`,
      updatedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
const getSystemSettings = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: currentSettings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
const updateSystemSettings = async (req, res, next) => {
  try {
    currentSettings = {
      ...currentSettings,
      ...req.body,
      lastUpdated: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'System settings updated successfully',
      data: currentSettings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getPendingVerifications,
  batchApproveActivities,
  getSystemSettings,
  updateSystemSettings,
};
