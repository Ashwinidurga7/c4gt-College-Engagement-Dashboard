const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Activity = require('../models/Activity');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const Department = require('../models/Department');
const Hod = require('../models/Hod');
const Campus = require('../models/Campus');
const notificationService = require('../services/notificationService');
const defaultSystemSettings = {
  academicYear: '2025-2026',
  currentSemester: 'Even (Spring 2026)',
  portalMaintenance: false,
  allowStudentRegistration: true,
  pointsApprovalThreshold: 100,
  maxPointsPerSemester: 150,
  contactSupportEmail: 'support@kiet.edu',
  lastUpdated: new Date(),
};

// In-memory reference for dynamic system settings
let currentSettings = { ...defaultSystemSettings };

// @desc    Get comprehensive admin dashboard analytics and counts
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      users,
      students,
      faculty,
      courses,
      activities,
      certificates,
      projects,
      departments,
    ] = await Promise.all([
      User.find(),
      Student.find(),
      Faculty.find(),
      Course.find(),
      Activity.find(),
      Certificate.find(),
      Project.find(),
      Department.find(),
    ]);

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

// @desc    Get all pending faculty registrations
// @route   GET /api/admin/faculty/pending
// @access  Private (Admin)
const getPendingFaculty = async (req, res, next) => {
  try {
    const allFaculty = await Faculty.find();
    const pendingFaculty = [];

    for (const f of allFaculty) {
      const u = f.user && f.user._id ? f.user : await User.findById(f.user);
      const isPending = f.approvalStatus === 'pending' || (u && u.approvalStatus === 'pending');
      if (isPending) {
        pendingFaculty.push({
          _id: f._id,
          userId: u ? (u._id || u.id) : null,
          name: u ? u.name : 'Unknown',
          email: u ? u.email : 'Unknown',
          department: f.department,
          assignedYears: f.assignedYears || [],
          approvalStatus: 'pending',
          isActive: f.isActive !== false,
          createdAt: f.createdAt || new Date(),
        });
      }
    }

    res.status(200).json({
      success: true,
      count: pendingFaculty.length,
      data: pendingFaculty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a faculty registration
// @route   PUT /api/admin/faculty/:id/approve
// @access  Private (Admin)
const approveFaculty = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    let faculty = await Faculty.findById(targetId);
    let user = null;

    if (faculty) {
      user = await User.findById(faculty.user?._id || faculty.user);
    } else {
      user = await User.findById(targetId);
      if (user) {
        faculty = await Faculty.findOne({ user: user._id || user.id });
      }
    }

    if (!faculty && !user) {
      return res.status(404).json({ success: false, message: 'Faculty registration not found' });
    }

    if (user) {
      await User.findByIdAndUpdate(user._id || user.id, {
        approvalStatus: 'approved',
        isActive: true,
      });
    }

    if (faculty) {
      await Faculty.findByIdAndUpdate(faculty._id || faculty.id, {
        approvalStatus: 'approved',
        isActive: true,
      });
    }

    const facultyUserId = user ? (user._id || user.id) : (faculty.user?._id || faculty.user);
    if (facultyUserId) {
      try {
        await notificationService.sendFacultyApprovalNotification(facultyUserId);
      } catch (notifErr) {
        console.error('Failed to notify faculty of approval:', notifErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Faculty registration approved successfully',
      data: {
        facultyId: faculty ? faculty._id : null,
        userId: facultyUserId,
        approvalStatus: 'approved',
        isActive: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a faculty registration
// @route   PUT /api/admin/faculty/:id/reject
// @access  Private (Admin)
const rejectFaculty = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const { remarks } = req.body;

    let faculty = await Faculty.findById(targetId);
    let user = null;

    if (faculty) {
      user = await User.findById(faculty.user?._id || faculty.user);
    } else {
      user = await User.findById(targetId);
      if (user) {
        faculty = await Faculty.findOne({ user: user._id || user.id });
      }
    }

    if (!faculty && !user) {
      return res.status(404).json({ success: false, message: 'Faculty registration not found' });
    }

    if (user) {
      await User.findByIdAndUpdate(user._id || user.id, {
        approvalStatus: 'rejected',
        isActive: false,
      });
    }

    if (faculty) {
      await Faculty.findByIdAndUpdate(faculty._id || faculty.id, {
        approvalStatus: 'rejected',
        isActive: false,
      });
    }

    const facultyUserId = user ? (user._id || user.id) : (faculty.user?._id || faculty.user);
    if (facultyUserId) {
      try {
        await notificationService.sendFacultyRejectionNotification(facultyUserId, remarks);
      } catch (notifErr) {
        console.error('Failed to notify faculty of rejection:', notifErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Faculty registration rejected',
      data: {
        facultyId: faculty ? faculty._id : null,
        userId: facultyUserId,
        approvalStatus: 'rejected',
        isActive: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending HOD registrations
// @route   GET /api/admin/hods/pending
// @access  Private (Admin)
const getPendingHods = async (req, res, next) => {
  try {
    const allHods = await Hod.find();
    const pendingHods = (allHods || []).filter((h) => h.approvalStatus === 'pending' || h.isActive === false);

    const allUsers = await User.find({ role: 'hod' });
    const pendingUsers = (allUsers || []).filter((u) => u.approvalStatus === 'pending' || u.isActive === false);

    const merged = [];
    for (const h of pendingHods) {
      const uId = h.user?._id || h.user;
      const u = allUsers.find((user) => String(user._id || user.id) === String(uId));
      const hObj = typeof h.toObject === 'function' ? h.toObject() : { ...h };
      merged.push({
        ...hObj,
        user: u || h.user,
        name: u ? u.name : (h.name || 'HOD'),
        email: u ? u.email : (h.email || 'Unknown'),
      });
    }

    for (const u of pendingUsers) {
      const alreadyIn = merged.some((h) => String(h.user?._id || h.user) === String(u._id || u.id));
      if (!alreadyIn) {
        merged.push({
          _id: `hod_pending_${u._id || u.id}`,
          user: u,
          name: u.name,
          email: u.email,
          college: u.college || 'KIET',
          approvalStatus: u.approvalStatus || 'pending',
          isActive: u.isActive !== false,
        });
      }
    }

    res.status(200).json({
      success: true,
      count: merged.length,
      data: merged,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a HOD registration
// @route   PUT /api/admin/hods/:id/approve
// @access  Private (Admin)
const approveHod = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    let hod = await Hod.findById(targetId);
    let user = null;

    if (hod) {
      user = await User.findById(hod.user?._id || hod.user);
    } else {
      user = await User.findById(targetId);
      if (user) {
        hod = await Hod.findOne({ user: user._id || user.id });
      }
    }

    if (!hod && !user) {
      return res.status(404).json({ success: false, message: 'HOD registration not found' });
    }

    if (user) {
      await User.findByIdAndUpdate(user._id || user.id, {
        approvalStatus: 'approved',
        isActive: true,
      });
    }

    if (hod) {
      await Hod.findByIdAndUpdate(hod._id || hod.id, {
        approvalStatus: 'approved',
        isActive: true,
      });
    }

    const hodUserId = user ? (user._id || user.id) : (hod.user?._id || hod.user);
    if (hodUserId) {
      try {
        await notificationService.sendHodApprovalResponseNotification({
          hodUserId,
          status: 'approved',
        });
      } catch (notifErr) {
        console.error('Failed to notify HOD of approval:', notifErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'HOD registration approved successfully',
      data: {
        hodId: hod ? hod._id : null,
        userId: hodUserId,
        approvalStatus: 'approved',
        isActive: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a HOD registration
// @route   PUT /api/admin/hods/:id/reject
// @access  Private (Admin)
const rejectHod = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const { remarks } = req.body;

    let hod = await Hod.findById(targetId);
    let user = null;

    if (hod) {
      user = await User.findById(hod.user?._id || hod.user);
    } else {
      user = await User.findById(targetId);
      if (user) {
        hod = await Hod.findOne({ user: user._id || user.id });
      }
    }

    if (!hod && !user) {
      return res.status(404).json({ success: false, message: 'HOD registration not found' });
    }

    if (user) {
      await User.findByIdAndUpdate(user._id || user.id, {
        approvalStatus: 'rejected',
        isActive: false,
      });
    }

    if (hod) {
      await Hod.findByIdAndUpdate(hod._id || hod.id, {
        approvalStatus: 'rejected',
        isActive: false,
      });
    }

    const hodUserId = user ? (user._id || user.id) : (hod.user?._id || hod.user);
    if (hodUserId) {
      try {
        await notificationService.sendHodApprovalResponseNotification({
          hodUserId,
          status: 'rejected',
          remarks: remarks || '',
        });
      } catch (notifErr) {
        console.error('Failed to notify HOD of rejection:', notifErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'HOD registration rejected',
      data: {
        hodId: hod ? hod._id : null,
        userId: hodUserId,
        approvalStatus: 'rejected',
        isActive: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get multi-campus overview governance data (KIET, KIET+, KIEW)
// @route   GET /api/admin/campus-overview
// @access  Private (Admin)
const getCampusOverview = async (req, res, next) => {
  try {
    const campuses = await Campus.find();
    res.status(200).json({
      success: true,
      data: campuses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all HODs from DB
// @route   GET /api/admin/hods
// @access  Private (Admin)
const getAllHods = async (req, res, next) => {
  try {
    const hods = await Hod.find();
    res.status(200).json({
      success: true,
      count: hods.length,
      data: hods,
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
  getPendingFaculty,
  approveFaculty,
  rejectFaculty,
  getPendingHods,
  approveHod,
  rejectHod,
  getCampusOverview,
  getAllHods,
};
