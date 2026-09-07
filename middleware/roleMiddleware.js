const Faculty = require('../models/Faculty');
const Hod = require('../models/Hod');
const Ctpo = require('../models/Ctpo');
const User = require('../models/User');

/**
 * Authorize specified roles with strict approval check for faculty, hod, and ctpo.
 */
const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'unauthenticated'}) is not authorized to access this route`,
      });
    }

    const userId = req.user._id || req.user.id;

    // If role is faculty, verify approved status and active account
    if (req.user.role === 'faculty') {
      const user = await User.findById(userId);
      const faculty = await Faculty.findOne({ user: userId });

      const isApproved =
        (user && user.approvalStatus === 'approved') ||
        (faculty && faculty.approvalStatus === 'approved') ||
        (!user?.approvalStatus && user?.isActive !== false);

      const isActive = (user?.isActive !== false) && (faculty?.isActive !== false);

      if (!isApproved || !isActive) {
        return res.status(403).json({
          success: false,
          message: 'Faculty account is pending approval or inactive',
          approvalStatus: user?.approvalStatus || faculty?.approvalStatus || 'pending',
        });
      }

      req.faculty = faculty;
    }

    // If role is hod, verify approved status and active account
    if (req.user.role === 'hod') {
      const user = await User.findById(userId);
      const hod = await Hod.findOne({ user: userId });

      const isApproved =
        (user && user.approvalStatus === 'approved') ||
        (hod && hod.approvalStatus === 'approved') ||
        (!user?.approvalStatus && user?.isActive !== false);

      const isActive = (user?.isActive !== false) && (hod?.isActive !== false);

      if (!isApproved || !isActive) {
        return res.status(403).json({
          success: false,
          message: 'HOD account is pending approval or inactive',
          approvalStatus: user?.approvalStatus || hod?.approvalStatus || 'pending',
        });
      }

      req.hod = hod || user;
    }

    // If role is ctpo, verify approved status and active account
    if (req.user.role === 'ctpo') {
      const user = await User.findById(userId);
      const ctpo = await Ctpo.findOne({ user: userId });

      const isApproved =
        (user && user.approvalStatus === 'approved') ||
        (ctpo && ctpo.approvalStatus === 'approved') ||
        (!user?.approvalStatus && user?.isActive !== false);

      const isActive = (user?.isActive !== false) && (ctpo?.isActive !== false);

      if (!isApproved || !isActive) {
        return res.status(403).json({
          success: false,
          message: 'CTPO account is pending approval or inactive',
          approvalStatus: user?.approvalStatus || ctpo?.approvalStatus || 'pending',
        });
      }

      req.ctpo = ctpo || user;
    }

    next();
  };
};

/**
 * Securely load faculty assignment from database (department and assigned years).
 */
const getFacultyAssignment = async (userId) => {
  const faculty = await Faculty.findOne({ user: userId });
  if (!faculty) return null;
  return {
    facultyId: faculty._id,
    department: faculty.department,
    assignedYears: faculty.assignedYears || (faculty.year ? [faculty.year] : []),
    approvalStatus: faculty.approvalStatus || 'approved',
    isActive: faculty.isActive !== false,
  };
};

module.exports = {
  authorize,
  getFacultyAssignment,
};
