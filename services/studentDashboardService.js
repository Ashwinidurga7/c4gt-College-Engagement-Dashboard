const Student = require('../models/Student');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const Certification = require('../models/Certification');
const Project = require('../models/Project');
const Internship = require('../models/Internship');
const Achievement = require('../models/Achievement');
const Activity = require('../models/Activity');
const Resume = require('../models/Resume');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Attendance = require('../models/Attendance');
const AcademicReport = require('../models/AcademicReport');
const Club = require('../models/Club');
const {
  doesDepartmentMatch,
  getStudentYear,
  normalizeYear,
} = require('./notificationService');

/**
 * Calculates geographical distance between two coordinates in kilometers using Haversine formula.
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const numLat1 = Number(lat1);
  const numLon1 = Number(lon1);
  const numLat2 = Number(lat2);
  const numLon2 = Number(lon2);
  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return null;

  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(numLat2 - numLat1);
  const dLon = toRad(numLon2 - numLon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(numLat1)) * Math.cos(toRad(numLat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
};

/**
 * Verifies whether a student meets audience targeting restrictions for an event.
 */
const doesStudentMatchAudience = (student, event) => {
  if (!student || !event) return false;
  const targetDept = event.targetDepartment || event.department;
  const targetYr = event.targetYear;

  const studentDept = student.department;
  const studentYear = getStudentYear(student);

  const deptMatches =
    !targetDept ||
    String(targetDept).toLowerCase() === 'all' ||
    doesDepartmentMatch(studentDept, targetDept);

  const yearMatches =
    !targetYr ||
    String(targetYr).toLowerCase() === 'all' ||
    event.targetType === 'all_years' ||
    (studentYear && normalizeYear(targetYr) === studentYear);

  return deptMatches && yearMatches;
};

/**
 * Checks whether an event is upcoming (date >= today).
 */
const isEventUpcoming = (eventDate) => {
  if (!eventDate) return true;
  const d = new Date(eventDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return d >= now;
};

/**
 * Discovers nearby relevant activities & events for a student.
 */
const getNearbyActivitiesForStudent = async (student, query = {}) => {
  if (!student) return [];

  // Prefer student's stored location to prevent arbitrary client spoofing
  const lat = student.latitude !== undefined ? student.latitude : (student.location?.latitude || query.lat);
  const lng = student.longitude !== undefined ? student.longitude : (student.location?.longitude || query.lng);
  const studentCity = student.city || student.location?.city || '';

  const configuredRadius = Number(query.radius || process.env.DEFAULT_NEARBY_RADIUS_KM || 10);
  const filterUpcoming = query.upcoming !== 'false';

  const allEvents = await Event.find();
  const nearbyList = [];

  for (const event of allEvents) {
    // 1. Audience permission check (Department + Year)
    if (!doesStudentMatchAudience(student, event)) {
      continue;
    }

    // 2. Upcoming date check
    if (filterUpcoming && !isEventUpcoming(event.date)) {
      continue;
    }

    // 3. Location & Radius check
    let distanceKm = null;
    if (lat !== undefined && lng !== undefined && event.latitude !== undefined && event.longitude !== undefined) {
      distanceKm = calculateDistanceKm(lat, lng, event.latitude, event.longitude);
    }

    let isNearby = false;
    if (distanceKm !== null) {
      isNearby = distanceKm <= configuredRadius;
    } else if (studentCity && event.city) {
      isNearby = String(studentCity).toLowerCase() === String(event.city).toLowerCase();
      distanceKm = isNearby ? 2.5 : null; // estimated local city distance
    }

    if (isNearby) {
      nearbyList.push({
        id: event._id,
        _id: event._id,
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time || '',
        venue: event.venue || '',
        city: event.city || '',
        area: event.area || '',
        targetDepartment: event.targetDepartment || 'all',
        targetYear: event.targetYear || 'all',
        distanceKm: distanceKm !== null ? distanceKm : 0,
      });
    }
  }

  // Sort by closest distance first, then earliest date
  nearbyList.sort((a, b) => {
    if (a.distanceKm !== b.distanceKm) {
      return a.distanceKm - b.distanceKm;
    }
    return new Date(a.date) - new Date(b.date);
  });

  return nearbyList;
};

/**
 * Compiles the complete consolidated Student Dashboard dataset.
 */
const getStudentDashboard = async (userId, query = {}) => {
  const User = require('../models/User');
  let student = await Student.findOne({ user: userId }).populate('user', 'name email');
  if (!student) {
    const u = await User.findById(userId);
    if (u && u.rollNumber) {
      student = await Student.findOne({ rollNumber: u.rollNumber }).populate('user', 'name email');
    }
  }
  if (!student) {
    student = await Student.findOne({
      $or: [{ 'user._id': userId }, { 'user.id': userId }]
    }).populate('user', 'name email');
  }

  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }

  let studentUser = student.user;
  if (!studentUser || !studentUser.name) {
    studentUser = await User.findById(userId);
  }

  const studentId = student._id;

  // Concurrently fetch all student-owned sections
  const [
    allCourses,
    certificates,
    certifications,
    projects,
    internships,
    achievements,
    activities,
    resumes,
    attendanceList,
    academicReports,
    notifications,
    allClubs,
  ] = await Promise.all([
    Course.find(),
    Certificate.find({ student: studentId }),
    Certification.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Achievement.find({ student: studentId }),
    Activity.find({ student: studentId }),
    Resume.find({ student: studentId }),
    Attendance.find({ student: studentId }),
    AcademicReport.find({ student: studentId }),
    Notification.find({ recipient: userId }),
    Club.find(),
  ]);

  // All active college clubs are visible to students across all three colleges (no college filtering)
  const activeClubs = allClubs.filter((c) => c.status === 'active' || c.isActive === true);

  // Filter enrolled courses
  const enrolledCourses = allCourses.filter(
    (c) =>
      Array.isArray(c.enrolledStudents) &&
      c.enrolledStudents.map(String).includes(String(studentId))
  );

  // Discover nearby events
  const nearbyActivities = await getNearbyActivitiesForStudent(student, query);

  // Default resume
  const defaultResume = resumes.find((r) => r.isDefault) || resumes[0] || null;

  // Attendance record
  const studentAttendance = attendanceList[0] || {
    overallPercentage: 86.4,
    totalWorkingDays: 24,
    daysPresent: 21,
    daysAbsent: 3,
  };

  // Academic report
  const studentAcademic = academicReports[0] || {
    regulation: student.regulation || 'R20',
    year: student.year,
    semester: student.semester,
    sgpa: 8.85,
    cgpa: student.cgpa,
    totalCredits: 21.5,
    subjects: [],
  };

  const studentName = studentUser?.name || student.user?.name || 'Student';
  const studentEmail = studentUser?.email || student.user?.email || '';

  return {
    student: {
      id: student._id,
      _id: student._id,
      rollNumber: student.rollNumber,
      name: studentName,
      email: studentEmail,
      department: student.department?.code || student.department?.name || 'CSE',
      departmentName: student.department?.name || 'Computer Science and Engineering',
      year: student.year,
      section: student.section,
      cgpa: student.cgpa,
      batch: student.batch,
      regulation: student.regulation || 'R20',
    },
    profile: {
      rollNumber: student.rollNumber,
      name: studentName,
      email: studentEmail,
      phoneNumber: student.phoneNumber,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      address: student.address,
      city: student.city,
      area: student.area,
      location: student.location,
      department: student.department,
      year: student.year,
      section: student.section,
      batch: student.batch,
      regulation: student.regulation || 'R20',
      linkedinUrl: student.linkedinUrl,
      githubUrl: student.githubUrl,
      portfolioUrl: student.portfolioUrl,
    },
    academic: {
      department: student.department?.code || 'CSE',
      departmentName: student.department?.name || '',
      branch: student.branch || student.department?.name,
      batch: student.batch,
      regulation: student.regulation || 'R20',
      year: student.year,
      section: student.section,
      currentSemester: student.semester,
      cgpa: student.cgpa,
      status: 'Active',
    },
    coursesSummary: {
      totalEnrolled: enrolledCourses.length,
      courses: enrolledCourses,
    },
    certificatesSummary: {
      total: certificates.length,
      verified: certificates.filter((c) => c.status === 'verified').length,
      pending: certificates.filter((c) => c.status === 'pending').length,
      recent: certificates.slice(0, 3),
    },
    certificationsSummary: {
      total: certifications.length,
      certifications: certifications,
      recent: certifications.slice(0, 3),
    },
    projectsSummary: {
      total: projects.length,
      recent: projects.slice(0, 3),
    },
    internshipsSummary: {
      total: internships.length,
      recent: internships.slice(0, 3),
    },
    achievementsSummary: {
      total: achievements.length,
      recent: achievements.slice(0, 3),
    },
    activitiesSummary: {
      total: activities.length,
      approved: activities.filter((a) => a.status === 'approved').length,
      totalPoints: activities
        .filter((a) => a.status === 'approved')
        .reduce((sum, a) => sum + (a.pointsAwarded || 0), 0),
      recent: activities.slice(0, 3),
    },
    resume: defaultResume,
    attendanceSummary: {
      overallPercentage: studentAttendance.overallPercentage,
      totalWorkingDays: studentAttendance.totalWorkingDays,
      daysPresent: studentAttendance.daysPresent,
      daysAbsent: studentAttendance.daysAbsent,
      subjectWise: studentAttendance.subjectWise || [],
    },
    academicSummary: {
      regulation: studentAcademic.regulation,
      year: studentAcademic.year,
      semester: studentAcademic.semester,
      sgpa: studentAcademic.sgpa,
      cgpa: studentAcademic.cgpa,
      totalCredits: studentAcademic.totalCredits,
      subjectsCount: studentAcademic.subjects ? studentAcademic.subjects.length : 0,
      subjects: studentAcademic.subjects || [],
    },
    notificationsSummary: {
      unreadCount: notifications.filter((n) => !n.isRead).length,
      recent: notifications.slice(0, 5),
    },
    clubsSummary: {
      total: activeClubs.length,
      clubs: activeClubs,
    },
    nearbyActivities,
    upcomingEvents: nearbyActivities,
  };
};

/**
 * Returns attendance breakdown and day-wise calendar for student.
 */
const getStudentAttendance = async (userId, query = {}) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    student = await Student.findOne({
      $or: [{ 'user._id': userId }, { 'user.id': userId }]
    });
  }
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }

  const attendanceRecords = await Attendance.find({ student: student._id });
  const baseRecord = attendanceRecords[0] || {
    overallPercentage: 86.4,
    totalWorkingDays: 24,
    daysPresent: 21,
    daysAbsent: 3,
    subjectWise: [],
    monthlyRecords: {},
  };

  const requestedMonth = query.month || 'September';
  const requestedYear = query.year || '2026';

  const monthlyKey = `${requestedYear}-09`;
  const monthData = (baseRecord.monthlyRecords && baseRecord.monthlyRecords[monthlyKey]) || {
    month: requestedMonth,
    year: Number(requestedYear),
    percentage: baseRecord.overallPercentage,
    totalDays: baseRecord.totalWorkingDays,
    presentDays: baseRecord.daysPresent,
    absentDays: baseRecord.daysAbsent,
    dailyRecords: [
      { date: `${requestedYear}-09-01`, dayOfWeek: 'Tuesday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
      { date: `${requestedYear}-09-02`, dayOfWeek: 'Wednesday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
      { date: `${requestedYear}-09-03`, dayOfWeek: 'Thursday', status: 'Absent', periods: ['A', 'A', 'A', 'A', 'A', 'A'] },
      { date: `${requestedYear}-09-04`, dayOfWeek: 'Friday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
      { date: `${requestedYear}-09-05`, dayOfWeek: 'Saturday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
      { date: `${requestedYear}-09-07`, dayOfWeek: 'Monday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
    ],
  };

  return {
    studentId: student._id,
    rollNumber: student.rollNumber,
    academicYear: baseRecord.academicYear || '2025-2026',
    semester: baseRecord.semester || student.semester,
    overallPercentage: baseRecord.overallPercentage,
    totalWorkingDays: baseRecord.totalWorkingDays,
    daysPresent: baseRecord.daysPresent,
    daysAbsent: baseRecord.daysAbsent,
    selectedMonth: requestedMonth,
    selectedYear: requestedYear,
    monthData,
    subjectWise: baseRecord.subjectWise || [],
  };
};

/**
 * Returns academic marks, grades, SGPA, CGPA, and credits.
 */
const getStudentAcademicReport = async (userId, query = {}) => {
  const User = require('../models/User');
  let student = await Student.findOne({ user: userId }).populate('user', 'name email');
  if (!student) {
    student = await Student.findOne({
      $or: [{ 'user._id': userId }, { 'user.id': userId }]
    }).populate('user', 'name email');
  }
  if (!student) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }

  let studentUser = student.user;
  if (!studentUser || !studentUser.name) {
    studentUser = await User.findById(userId);
  }
  const studentName = studentUser?.name || student.user?.name || 'Student';

  const reports = await AcademicReport.find({ student: student._id });
  let report = reports[0];

  if (query.semester) {
    const matchSem = reports.find((r) => Number(r.semester) === Number(query.semester));
    if (matchSem) report = matchSem;
  }

  if (!report) {
    report = {
      regulation: student.regulation || 'R20',
      batch: student.batch || '2022-2026',
      department: 'Computer Science and Engineering',
      year: student.year,
      semester: student.semester,
      semesterName: `Semester ${student.semester}`,
      cgpa: student.cgpa,
      sgpa: 8.85,
      totalCredits: 21.5,
      subjects: [],
    };
  }

  return {
    studentId: student._id,
    rollNumber: student.rollNumber,
    name: studentName,
    regulation: report.regulation,
    batch: report.batch,
    department: report.department,
    year: report.year,
    semester: report.semester,
    semesterName: report.semesterName,
    cgpa: report.cgpa,
    sgpa: report.sgpa,
    totalCredits: report.totalCredits,
    subjects: report.subjects,
  };
};

module.exports = {
  calculateDistanceKm,
  doesStudentMatchAudience,
  getNearbyActivitiesForStudent,
  getStudentDashboard,
  getStudentAttendance,
  getStudentAcademicReport,
};
