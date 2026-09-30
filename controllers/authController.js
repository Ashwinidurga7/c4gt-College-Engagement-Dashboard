const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');
const emailService = require('../services/emailService');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Hod = require('../models/Hod');
const Ctpo = require('../models/Ctpo');
const Department = require('../models/Department');
const notificationService = require('../services/notificationService');
const {
  isValidCollege,
  normalizeCollege,
  normalizeSection,
} = require('../services/accessControlService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const resolveDepartment = async (department) => {
  if (!department) return null;
  const allDepts = await Department.find();
  const matchedDept = (allDepts || []).find(
    (d) =>
      String(d.code).toLowerCase() === String(department).toLowerCase() ||
      String(d.name).toLowerCase() === String(department).toLowerCase() ||
      String(d._id) === String(department)
  );
  if (matchedDept) {
    return {
      _id: matchedDept._id,
      name: matchedDept.name,
      code: matchedDept.code,
    };
  }
  return {
    _id: `dept_${String(department).toLowerCase().replace(/\s+/g, '_')}`,
    name: department,
    code: typeof department === 'string' ? department.toUpperCase() : 'DEPT',
  };
};

// @desc    Register a new user (Generic: student / faculty / hod / ctpo)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, college, department, year, academicYear, assignedYears, section, rollNumber, branch } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userRole = (role || 'student').toLowerCase();

    // Delegate to specialized handlers if role is hod or ctpo
    if (userRole === 'hod') {
      return registerHod(req, res, next);
    }
    if (userRole === 'ctpo') {
      return registerCtpo(req, res, next);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const isFaculty = userRole === 'faculty';

    // Faculty specific mandatory fields validation
    if (isFaculty) {
      if (!department || (!year && (!assignedYears || assignedYears.length === 0))) {
        return res.status(400).json({
          success: false,
          message: 'Department and academic year are required for faculty registration',
        });
      }
    }

    const deptObj = isFaculty ? await resolveDepartment(department) : null;
    const yearsList = assignedYears
      ? (Array.isArray(assignedYears) ? assignedYears : [assignedYears])
      : (year ? (Array.isArray(year) ? year : [year]) : []);

    const userCollege = college ? normalizeCollege(college) : 'KIET';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      rollNumber: rollNumber ? String(rollNumber).trim().toUpperCase() : undefined,
      department: department || undefined,
      branch: branch || undefined,
      year: year || academicYear || undefined,
      section: section || undefined,
      college: userCollege,
      approvalStatus: isFaculty ? 'pending' : 'approved',
      isActive: isFaculty ? false : true,
    });

    if (userRole === 'student') {
      try {
        await Student.create({
          user: user._id,
          name: user.name,
          rollNumber: rollNumber ? String(rollNumber).trim().toUpperCase() : undefined,
          college: userCollege,
          department: department || 'Computer Science & Engineering',
          branch: branch || (typeof department === 'string' ? department : 'CSE'),
          year: year || academicYear || '3rd Year',
          section: section || 'A',
        });
      } catch (stErr) {
        console.warn('Student profile creation notice:', stErr.message);
      }
    }

    let facultyProfile = null;
    if (isFaculty) {
      facultyProfile = await Faculty.create({
        user: user._id,
        employeeId: `FAC${Math.floor(100 + Math.random() * 900)}`,
        college: userCollege,
        department: deptObj,
        assignedYears: yearsList,
        approvalStatus: 'pending',
        isActive: false,
      });

      try {
        await notificationService.sendFacultyRegistrationNotification({
          facultyUser: user,
          name: user.name,
          department: deptObj,
          departmentName: deptObj.code || deptObj.name,
          year: yearsList.join(', '),
        });
      } catch (notifErr) {
        console.error('Failed to dispatch admin notification for faculty registration:', notifErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: isFaculty
        ? 'Faculty registration submitted successfully. Your account is pending administrator approval.'
        : 'Registration successful',
      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        rollNumber: user.rollNumber,
        department: user.department || (isFaculty ? deptObj : undefined),
        branch: user.branch,
        year: user.year,
        section: user.section,
        approvalStatus: user.approvalStatus,
        isActive: user.isActive,
        assignedYears: isFaculty ? yearsList : undefined,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new Head of Department (HOD)
// @route   POST /api/auth/register/hod
// @access  Public
const registerHod = async (req, res, next) => {
  try {
    const { name, email, password, college, department, academicYear, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (!college || !isValidCollege(college)) {
      return res.status(400).json({
        success: false,
        message: 'Valid institutional college is required (KIET, KIET+, or KIEW)',
      });
    }

    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required for HOD registration' });
    }

    const assignedYear = academicYear || year;
    if (!assignedYear) {
      return res.status(400).json({ success: false, message: 'Academic year is required for HOD registration' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const normCollege = normalizeCollege(college);
    const deptObj = await resolveDepartment(department);

    const user = await User.create({
      name,
      email,
      password,
      role: 'hod',
      college: normCollege,
      approvalStatus: 'pending',
      isActive: false,
    });

    const hodProfile = await Hod.create({
      user: user._id,
      employeeId: `HOD${Math.floor(100 + Math.random() * 900)}`,
      college: normCollege,
      department: deptObj,
      academicYear: assignedYear,
      year: assignedYear,
      designation: 'Head of Department',
      approvalStatus: 'pending',
      isActive: false,
    });

    // Notify admins about pending HOD registration
    try {
      await notificationService.sendHodRegistrationNotification({
        _id: hodProfile._id,
        user,
        name: user.name,
        college: normCollege,
        department: deptObj,
        academicYear: assignedYear,
      });
    } catch (notifErr) {
      console.error('Failed to notify admins of HOD registration:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'HOD registration submitted successfully. Your account is pending administrator approval.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: normCollege,
        department: deptObj,
        academicYear: assignedYear,
        approvalStatus: 'pending',
        isActive: false,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new Class Teacher & Placement Officer (CTPO)
// @route   POST /api/auth/register/ctpo
// @access  Public
const registerCtpo = async (req, res, next) => {
  try {
    const { name, email, password, college, department, academicYear, year, section, class: className } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (!college || !isValidCollege(college)) {
      return res.status(400).json({
        success: false,
        message: 'Valid institutional college is required (KIET, KIET+, or KIEW)',
      });
    }

    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required for CTPO registration' });
    }

    const assignedYear = academicYear || year;
    if (!assignedYear) {
      return res.status(400).json({ success: false, message: 'Academic year is required for CTPO registration' });
    }

    const assignedSec = section || className;
    if (!assignedSec) {
      return res.status(400).json({ success: false, message: 'Section/Class is required for CTPO registration' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const normCollege = normalizeCollege(college);
    const normSection = normalizeSection(assignedSec);
    const deptObj = await resolveDepartment(department);

    const user = await User.create({
      name,
      email,
      password,
      role: 'ctpo',
      college: normCollege,
      approvalStatus: 'pending',
      isActive: false,
    });

    const ctpoProfile = await Ctpo.create({
      user: user._id,
      employeeId: `CTPO${Math.floor(100 + Math.random() * 900)}`,
      college: normCollege,
      department: deptObj,
      academicYear: assignedYear,
      year: assignedYear,
      section: normSection,
      class: normSection,
      designation: 'Class Teacher & Placement Officer',
      approvalStatus: 'pending',
      isActive: false,
    });

    // Notify matching HOD(s)
    try {
      await notificationService.sendCtpoRegistrationNotification({
        _id: ctpoProfile._id,
        user,
        name: user.name,
        college: normCollege,
        department: deptObj,
        academicYear: assignedYear,
        section: normSection,
      });
    } catch (notifErr) {
      console.error('Failed to notify HOD of CTPO registration:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'CTPO registration submitted successfully. Your account is pending HOD approval.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: normCollege,
        department: deptObj,
        academicYear: assignedYear,
        section: normSection,
        approvalStatus: 'pending',
        isActive: false,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const rawId = req.body.email || req.body.identifier || req.body.rollNumber || '';
    const email = String(rawId).trim();
    const password = String(req.body.password || '').trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide roll number / email and password' });
    }

    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      user = await User.findOne({ rollNumber: email.toUpperCase() }).select('+password');
    }
    if (!user) {
      user = await User.findOne({ rollNumber: email }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid roll number / email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let roleData = {};

    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id });
      if (student) {
        roleData.student = {
          rollNumber: student.rollNumber,
          department: student.department,
          assignedYears: student.year ? [student.year] : [],
          year: student.year,
          section: student.section,
          semester: student.semester,
          cgpa: student.cgpa,
          branch: student.branch,
          campus: student.college || user.college,
        };
      }
    } else if (user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: user._id });
      if (faculty) {
        roleData.faculty = {
          department: faculty.department,
          assignedYears: faculty.assignedYears || [],
          approvalStatus: faculty.approvalStatus || user.approvalStatus || 'approved',
        };
      }
    } else if (user.role === 'hod') {
      const hod = await Hod.findOne({ user: user._id });
      if (hod) {
        roleData.hod = {
          college: hod.college || user.college,
          department: hod.department,
          academicYear: hod.academicYear || hod.year,
          approvalStatus: hod.approvalStatus || user.approvalStatus || 'approved',
        };
      }
    } else if (user.role === 'ctpo') {
      const ctpo = await Ctpo.findOne({ user: user._id });
      if (ctpo) {
        roleData.ctpo = {
          college: ctpo.college || user.college,
          department: ctpo.department,
          academicYear: ctpo.academicYear || ctpo.year,
          section: ctpo.section || ctpo.class,
          approvalStatus: ctpo.approvalStatus || user.approvalStatus || 'approved',
        };
      }
    }

    const resolvedApprovalStatus =
      user.approvalStatus ||
      roleData.hod?.approvalStatus ||
      roleData.ctpo?.approvalStatus ||
      roleData.faculty?.approvalStatus ||
      'approved';

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        rollNumber: user.rollNumber || roleData.student?.rollNumber,
        department: roleData.student?.department || roleData.faculty?.department || roleData.hod?.department,
        branch: roleData.student?.branch,
        year: roleData.student?.year,
        semester: roleData.student?.semester,
        section: roleData.student?.section,
        campus: user.college || 'KIET',
        approvalStatus: resolvedApprovalStatus,
        isActive: user.isActive !== false,
        ...roleData,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    delete userObj.password;

    let roleData = {};
    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id });
      if (student) {
        roleData = {
          rollNumber: student.rollNumber,
          department: student.department,
          assignedYears: student.year ? [student.year] : [],
          year: student.year,
          section: student.section,
          semester: student.semester,
          branch: student.branch,
          cgpa: student.cgpa,
          campus: student.college || user.college,
          student: {
            rollNumber: student.rollNumber,
            department: student.department,
            assignedYears: student.year ? [student.year] : [],
            year: student.year,
            section: student.section,
            semester: student.semester,
            branch: student.branch,
            cgpa: student.cgpa,
            campus: student.college || user.college,
          },
        };
      }
    } else if (user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: user._id });
      if (faculty) {
        roleData = {
          department: faculty.department,
          assignedYears: faculty.assignedYears || [],
          approvalStatus: faculty.approvalStatus || user.approvalStatus || 'approved',
          faculty: {
            department: faculty.department,
            assignedYears: faculty.assignedYears || [],
            approvalStatus: faculty.approvalStatus || user.approvalStatus || 'approved',
          },
        };
      }
    } else if (user.role === 'hod') {
      const hod = await Hod.findOne({ user: user._id });
      if (hod) {
        roleData = {
          college: hod.college || user.college,
          department: hod.department,
          academicYear: hod.academicYear || hod.year,
          approvalStatus: hod.approvalStatus || user.approvalStatus || 'approved',
          hod: {
            college: hod.college || user.college,
            department: hod.department,
            academicYear: hod.academicYear || hod.year,
            approvalStatus: hod.approvalStatus || user.approvalStatus || 'approved',
          },
        };
      }
    } else if (user.role === 'ctpo') {
      const ctpo = await Ctpo.findOne({ user: user._id });
      if (ctpo) {
        roleData = {
          college: ctpo.college || user.college,
          department: ctpo.department,
          academicYear: ctpo.academicYear || ctpo.year,
          section: ctpo.section || ctpo.class,
          approvalStatus: ctpo.approvalStatus || user.approvalStatus || 'approved',
          ctpo: {
            college: ctpo.college || user.college,
            department: ctpo.department,
            academicYear: ctpo.academicYear || ctpo.year,
            section: ctpo.section || ctpo.class,
            approvalStatus: ctpo.approvalStatus || user.approvalStatus || 'approved',
          },
        };
      }
    }

    const resolvedApprovalStatus =
      user.approvalStatus ||
      roleData.hod?.approvalStatus ||
      roleData.ctpo?.approvalStatus ||
      roleData.faculty?.approvalStatus ||
      'approved';

    res.status(200).json({
      success: true,
      data: {
        ...userObj,
        id: user._id,
        _id: user._id,
        approvalStatus: resolvedApprovalStatus,
        ...roleData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset email
// @route   POST /api/auth/forgot-password
// @desc    Request password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const rawEmail = req.body && req.body.email;
    if (!rawEmail || String(rawEmail).trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const email = String(rawEmail).trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format (e.g. student@kiet.edu)',
      });
    }

    const genericSuccessMessage = 'If an account exists for this email, a password reset link has been sent.';

    const user = await User.findOne({ email });
    // Anti-enumeration: if user doesn't exist, return generic success without revealing existence
    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericSuccessMessage,
        data: { message: genericSuccessMessage },
      });
    }

    // Generate 32-byte cryptographically secure random reset token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Configurable expiry (default 30 minutes)
    const expiryMinutes = Number(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 30;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Invalidate previous unused reset tokens for this user
    await PasswordResetToken.updateMany(
      { userId: user._id, usedAt: null },
      { usedAt: new Date() }
    );

    // Store secure token record in dedicated password_reset_tokens collection
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash: hashedToken,
      expiresAt,
      usedAt: null,
    });

    // Also update User document for backward compatibility
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save({ validateBeforeSave: false });

    // Reload dotenv dynamically to capture updated host configuration
    dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

    let frontendUrl = (process.env.FRONTEND_URL || '').trim();
    if (!frontendUrl) {
      frontendUrl = 'http://10.228.3.65:5173';
    }
    frontendUrl = frontendUrl.replace(/\/+$/, '');
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    let emailDelivered = false;
    try {
      await emailService.sendPasswordResetEmail({
        to: user.email,
        resetUrl,
        minutesToExpire: expiryMinutes,
        name: user.name || 'User',
      });
      emailDelivered = true;
    } catch (emailErr) {
      console.warn('⚠️ [Email Delivery Warning]:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: genericSuccessMessage,
      data: {
        message: genericSuccessMessage,
        emailDelivered,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate password reset token
// @route   GET /api/auth/validate-reset-token
// @access  Public
const validateResetToken = async (req, res, next) => {
  try {
    const rawToken = req.query.token;
    if (!rawToken || String(rawToken).trim() === '') {
      return res.status(400).json({
        success: false,
        detail: 'This password reset link is invalid or has expired.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(String(rawToken).trim()).digest('hex');

    // 1. Check dedicated password_reset_tokens collection
    let tokenDoc = await PasswordResetToken.findOne({
      tokenHash: hashedToken,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    // 2. Fallback check User collection for backward compatibility
    let user = null;
    if (tokenDoc) {
      user = await User.findById(tokenDoc.userId);
    } else {
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      });
    }

    if (!user || (!tokenDoc && !user.resetPasswordToken)) {
      return res.status(400).json({
        success: false,
        detail: 'This password reset link is invalid or has expired.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid.',
      data: { valid: true },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, new_password, newPassword, confirm_password, confirmPassword, password } = req.body;
    const finalPassword = new_password || newPassword || password;
    const finalConfirm = confirm_password || confirmPassword;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Missing password reset token. Please request a new reset link.',
        detail: 'This password reset link is invalid or has expired.',
      });
    }

    if (!finalPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password.',
      });
    }

    if (finalConfirm && finalPassword !== finalConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Industrial password strength requirements
    const isMinLength = finalPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(finalPassword);
    const hasLower = /[a-z]/.test(finalPassword);
    const hasDigit = /\d/.test(finalPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(finalPassword);

    if (!isMinLength || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(String(token).trim()).digest('hex');

    // 1. Search in dedicated PasswordResetToken collection
    let tokenDoc = await PasswordResetToken.findOne({
      tokenHash: hashedToken,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    let user = null;
    if (tokenDoc) {
      user = await User.findById(tokenDoc.userId);
    } else {
      // 2. Fallback search on User document
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        detail: 'This password reset link is invalid or has expired.',
        message: 'Invalid or expired password reset token.',
      });
    }

    // Update password (pre-save hook will hash it with bcrypt)
    user.password = finalPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Mark token as used
    if (tokenDoc) {
      tokenDoc.usedAt = new Date();
      await tokenDoc.save();
    }

    // Invalidate all other active tokens for this user
    await PasswordResetToken.updateMany(
      { userId: user._id, usedAt: null },
      { usedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
      data: {
        message: 'Password has been reset successfully.',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  registerHod,
  registerCtpo,
  loginUser,
  getMe,
  updatePassword,
  forgotPassword,
  validateResetToken,
  resetPassword,
};

