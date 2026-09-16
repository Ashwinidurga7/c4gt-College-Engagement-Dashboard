const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const AcademicReport = require('../models/AcademicReport');
const Certification = require('../models/Certification');
const Activity = require('../models/Activity');
const {
  canCtpoAccessStudent,
} = require('../services/accessControlService');

/**
 * Helper to get CTPO record from req.ctpo or DB
 */
const getCtpoProfile = async (req) => {
  if (req.ctpo && req.ctpo.college && req.ctpo.department) {
    return req.ctpo;
  }
  const CtpoModel = require('../models/Ctpo');
  const userId = req.user._id || req.user.id;
  const ctpo = await CtpoModel.findOne({ user: userId });
  return ctpo || req.user;
};

// @desc    Get scoped CTPO dashboard overview
// @route   GET /api/ctpo/dashboard
// @access  Private (CTPO)
const getCtpoDashboard = async (req, res, next) => {
  try {
    const ctpo = await getCtpoProfile(req);
    const allStudents = await Student.find();
    const scopedStudents = (allStudents || []).filter((s) => canCtpoAccessStudent(ctpo, s));

    const studentIds = scopedStudents.map((s) => String(s._id || s.id));

    let totalCgpa = 0;
    for (const s of scopedStudents) {
      totalCgpa += Number(s.cgpa || 0);
    }
    const avgCgpa = scopedStudents.length > 0 ? (totalCgpa / scopedStudents.length).toFixed(2) : 0;

    // Certifications & activities in this section
    const allCerts = await Certification.find();
    const scopedCerts = (allCerts || []).filter((c) => studentIds.includes(String(c.student || c.studentId)));

    const allActs = await Activity.find();
    const scopedActs = (allActs || []).filter((a) => studentIds.includes(String(a.student?._id || a.student)));

    // Attendance in this section
    const allAttendance = await Attendance.find();
    const scopedAttendance = (allAttendance || []).filter((att) =>
      studentIds.includes(String(att.student || att.studentId))
    );

    res.status(200).json({
      success: true,
      data: {
        scope: {
          college: ctpo.college,
          department: ctpo.department?.name || ctpo.department?.code || ctpo.department,
          academicYear: ctpo.academicYear || ctpo.year,
          section: ctpo.section || ctpo.class,
        },
        counts: {
          students: scopedStudents.length,
          certifications: scopedCerts.length,
          activities: scopedActs.length,
          attendanceRecords: scopedAttendance.length,
        },
        academicOverview: {
          averageCgpa: Number(avgCgpa),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get students in CTPO's assigned class/section
// @route   GET /api/ctpo/students
// @access  Private (CTPO)
const getCtpoStudents = async (req, res, next) => {
  try {
    const ctpo = await getCtpoProfile(req);
    const { search, cgpaMin } = req.query;

    const allStudents = await Student.find();
    let scoped = (allStudents || []).filter((s) => canCtpoAccessStudent(ctpo, s));

    if (cgpaMin) {
      const min = parseFloat(cgpaMin);
      if (!isNaN(min)) {
        scoped = scoped.filter((s) => (s.cgpa || 0) >= min);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      scoped = scoped.filter(
        (s) =>
          (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
          (s.user?.name && s.user.name.toLowerCase().includes(q)) ||
          (s.user?.email && s.user.email.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: scoped.length,
      data: scoped,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student details with CTPO scope check
// @route   GET /api/ctpo/students/:id
// @access  Private (CTPO)
const getCtpoStudentById = async (req, res, next) => {
  try {
    const ctpo = await getCtpoProfile(req);
    const targetId = req.params.id;

    const student = await Student.findById(targetId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (!canCtpoAccessStudent(ctpo, student)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student is outside your assigned class/section, year, department, or college scope',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records for CTPO's section
// @route   GET /api/ctpo/attendance
// @access  Private (CTPO)
const getCtpoAttendance = async (req, res, next) => {
  try {
    const ctpo = await getCtpoProfile(req);
    const allStudents = await Student.find();
    const scopedStudents = (allStudents || []).filter((s) => canCtpoAccessStudent(ctpo, s));
    const studentIds = scopedStudents.map((s) => String(s._id || s.id));

    const allAttendance = await Attendance.find();
    const scopedAttendance = (allAttendance || []).filter((att) =>
      studentIds.includes(String(att.student || att.studentId))
    );

    res.status(200).json({
      success: true,
      count: scopedAttendance.length,
      data: scopedAttendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get academic reports for CTPO's section
// @route   GET /api/ctpo/academic-report
// @access  Private (CTPO)
const getCtpoAcademicReport = async (req, res, next) => {
  try {
    const ctpo = await getCtpoProfile(req);
    const allStudents = await Student.find();
    const scopedStudents = (allStudents || []).filter((s) => canCtpoAccessStudent(ctpo, s));
    const studentIds = scopedStudents.map((s) => String(s._id || s.id));

    const allReports = await AcademicReport.find();
    const scopedReports = (allReports || []).filter((rep) =>
      studentIds.includes(String(rep.student || rep.studentId))
    );

    res.status(200).json({
      success: true,
      count: scopedReports.length,
      data: scopedReports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCtpoDashboard,
  getCtpoStudents,
  getCtpoStudentById,
  getCtpoAttendance,
  getCtpoAcademicReport,
};
