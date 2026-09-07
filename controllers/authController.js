const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
    const { name, email, password, role, college, department, year, academicYear, assignedYears, section } = req.body;

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
      college: userCollege,
      approvalStatus: isFaculty ? 'pending' : 'approved',
      isActive: isFaculty ? false : true,
    });

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
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        approvalStatus: user.approvalStatus,
        isActive: user.isActive,
        department: isFaculty ? deptObj : undefined,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let roleData = {};

    if (user.role === 'faculty') {
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
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
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
    res.status(200).json({
      success: true,
      data: user,
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

module.exports = {
  registerUser,
  registerHod,
  registerCtpo,
  loginUser,
  getMe,
  updatePassword,
};
