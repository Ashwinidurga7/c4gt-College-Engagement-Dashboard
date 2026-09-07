const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const Certification = require('../models/Certification');
const Project = require('../models/Project');
const Internship = require('../models/Internship');
const Achievement = require('../models/Achievement');
const Activity = require('../models/Activity');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const studentDashboardService = require('../services/studentDashboardService');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { isFacultyApprovedAndActive } = require('../services/notificationService');
const { canFacultyAccessStudent } = require('../services/accessControlService');

router.use(protect);

// @desc    Get all students (scoped by department & year for faculty)
// @route   GET /api/students
router.get('/', authorize('admin', 'faculty', 'department_head'), async (req, res, next) => {
  try {
    let students = await Student.find()
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (req.user.role === 'faculty') {
      const faculty = req.faculty || (await Faculty.findOne({ user: req.user.id }));
      if (!faculty || !isFacultyApprovedAndActive(faculty)) {
        return res.status(403).json({
          success: false,
          message: 'Faculty account is pending approval or inactive',
        });
      }

      students = students.filter((s) => canFacultyAccessStudent(faculty, s));
    }

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current student's profile
// @route   GET /api/students/me
router.get('/me', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Consolidated Student Dashboard Data
// @route   GET /api/students/dashboard
// @access  Private (Student only)
router.get('/dashboard', authorize('student'), async (req, res, next) => {
  try {
    const dashboardData = await studentDashboardService.getStudentDashboard(req.user.id, req.query);
    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get logged-in student personal details / profile
// @route   GET /api/students/profile
// @access  Private (Student only)
router.get('/profile', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Update logged-in student personal profile
// @route   PUT /api/students/profile
// @access  Private (Student only)
router.put('/profile', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const allowedUpdates = [
      'phoneNumber',
      'dateOfBirth',
      'gender',
      'address',
      'city',
      'area',
      'latitude',
      'longitude',
      'location',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
    ];

    const updateData = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (req.body.city || req.body.area || req.body.latitude || req.body.longitude) {
      updateData.location = {
        city: req.body.city || student.city || '',
        area: req.body.area || student.area || '',
        latitude: req.body.latitude !== undefined ? Number(req.body.latitude) : student.latitude,
        longitude: req.body.longitude !== undefined ? Number(req.body.longitude) : student.longitude,
      };
    }

    const updated = await Student.findByIdAndUpdate(student._id, updateData, { new: true });
    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student academic information
// @route   GET /api/students/academic
// @access  Private (Student only)
router.get('/academic', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('department', 'name code');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        department: student.department?.code || 'CSE',
        departmentName: student.department?.name || 'Computer Science and Engineering',
        branch: student.branch || student.department?.name,
        batch: student.batch,
        regulation: student.regulation || 'R20',
        year: student.year,
        section: student.section,
        currentSemester: student.semester,
        cgpa: student.cgpa,
        academicStatus: 'Active',
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student enrolled courses
// @route   GET /api/students/courses
// @access  Private (Student only)
router.get('/courses', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const allCourses = await Course.find();
    const enrolled = allCourses.filter(
      (c) =>
        Array.isArray(c.enrolledStudents) &&
        c.enrolledStudents.map(String).includes(String(student._id))
    );

    res.status(200).json({ success: true, count: enrolled.length, data: enrolled });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student certificates
// @route   GET /api/students/certificates
// @access  Private (Student only)
router.get('/certificates', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const certificates = await Certificate.find({ student: student._id });
    res.status(200).json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student certifications
// @route   GET /api/students/certifications
// @access  Private (Student only)
router.get('/certifications', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const allCerts = await Certification.find();
    const certs = allCerts.filter(
      (c) => String(c.student?._id || c.student || c.studentId) === String(student._id)
    );
    res.status(200).json({ success: true, count: certs.length, data: certs });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student projects
// @route   GET /api/students/projects
// @access  Private (Student only)
router.get('/projects', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const projects = await Project.find({ student: student._id });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student internships
// @route   GET /api/students/internships
// @access  Private (Student only)
router.get('/internships', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const internships = await Internship.find({ student: student._id });
    res.status(200).json({ success: true, count: internships.length, data: internships });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student achievements
// @route   GET /api/students/achievements
// @access  Private (Student only)
router.get('/achievements', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const achievements = await Achievement.find({ student: student._id });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student activities
// @route   GET /api/students/activities
// @access  Private (Student only)
router.get('/activities', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const activities = await Activity.find({ student: student._id });
    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student comprehensive portfolio summary
// @route   GET /api/students/portfolio
// @access  Private (Student only)
router.get('/portfolio', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const [projects, internships, achievements, certifications, activities] = await Promise.all([
      Project.find({ student: student._id }),
      Internship.find({ student: student._id }),
      Achievement.find({ student: student._id }),
      Certification.find({ student: student._id }),
      Activity.find({ student: student._id }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        student,
        projects,
        internships,
        achievements,
        certifications,
        activities,
        totalPoints: activities
          .filter((a) => a.status === 'approved')
          .reduce((sum, a) => sum + (a.pointsAwarded || 0), 0),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student primary resume
// @route   GET /api/students/resume
// @access  Private (Student only)
router.get('/resume', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const resumes = await Resume.find({ student: student._id });
    const primaryResume = resumes.find((r) => r.isDefault) || resumes[0] || null;

    res.status(200).json({ success: true, data: primaryResume });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student attendance report (with calendar & subject percentages)
// @route   GET /api/students/attendance
// @access  Private (Student only)
router.get('/attendance', authorize('student'), async (req, res, next) => {
  try {
    const attendance = await studentDashboardService.getStudentAttendance(req.user.id, req.query);
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student academic report (grades, credits, SGPA, CGPA)
// @route   GET /api/students/academic-report
// @access  Private (Student only)
router.get('/academic-report', authorize('student'), async (req, res, next) => {
  try {
    const report = await studentDashboardService.getStudentAcademicReport(req.user.id, req.query);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student private notifications
// @route   GET /api/students/notifications
// @access  Private (Student only)
router.get('/notifications', authorize('student'), async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
});

// @desc    Get nearby activities / events matching location radius + department/year permissions
// @route   GET /api/students/nearby-activities
// @access  Private (Student only)
router.get('/nearby-activities', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const nearby = await studentDashboardService.getNearbyActivitiesForStudent(student, req.query);
    res.status(200).json({
      success: true,
      count: nearby.length,
      data: nearby,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get upcoming events for student
// @route   GET /api/students/upcoming-events
// @access  Private (Student only)
router.get('/upcoming-events', authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const events = await studentDashboardService.getNearbyActivitiesForStudent(student, { ...req.query, upcoming: 'true' });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('department', 'name code');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Faculty isolation: department + year check
    if (req.user.role === 'faculty') {
      const faculty = req.faculty || (await Faculty.findOne({ user: req.user.id }));
      if (!faculty || !isFacultyApprovedAndActive(faculty)) {
        return res.status(403).json({
          success: false,
          message: 'Faculty account is pending approval or inactive',
        });
      }

      if (!canFacultyAccessStudent(faculty, student)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot access student records outside your assigned department and academic year',
        });
      }
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Create student profile
// @route   POST /api/students
router.post('/', async (req, res, next) => {
  try {
    const existing = await Student.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Student profile already exists' });
    }

    const student = await Student.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// @desc    Update student profile
// @route   PUT /api/students/:id
router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Only owning student or admin can update
    const studentUserId = student.user?._id || student.user;
    if (req.user.role === 'student' && String(studentUserId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Student Achievements
router.get('/:id/achievements', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (req.user.role === 'faculty') {
      const faculty = req.faculty || (await Faculty.findOne({ user: req.user.id }));
      if (!canFacultyAccessStudent(faculty, student)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot access student records outside your assigned department and academic year',
        });
      }
    }

    const achievements = await Achievement.find({ student: req.params.id });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
});

// Student Internships
router.get('/:id/internships', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (req.user.role === 'faculty') {
      const faculty = req.faculty || (await Faculty.findOne({ user: req.user.id }));
      if (!canFacultyAccessStudent(faculty, student)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot access student records outside your assigned department and academic year',
        });
      }
    }

    const internships = await Internship.find({ student: req.params.id });
    res.status(200).json({ success: true, count: internships.length, data: internships });
  } catch (error) {
    next(error);
  }
});

// Student Certifications
router.get('/:id/certifications', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (req.user.role === 'faculty') {
      const faculty = req.faculty || (await Faculty.findOne({ user: req.user.id }));
      if (!canFacultyAccessStudent(faculty, student)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot access student records outside your assigned department and academic year',
        });
      }
    }

    const certifications = await Certification.find({ student: req.params.id });
    res.status(200).json({ success: true, count: certifications.length, data: certifications });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete student profile
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Student profile deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
