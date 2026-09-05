const Course = require('../models/Course');
const Student = require('../models/Student');

// @desc    Get all courses with optional filtering
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res, next) => {
  try {
    const { department, semester, search } = req.query;
    let courses = await Course.find();

    if (department) {
      courses = courses.filter((c) => String(c.department) === String(department));
    }
    if (semester) {
      courses = courses.filter((c) => String(c.semester) === String(semester));
    }
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.code && c.code.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin, Faculty)
const createCourse = async (req, res, next) => {
  try {
    const { code, name, department, credits, semester, capacity, syllabus, description } = req.body;

    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'Course code and name are required' });
    }

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: `Course with code ${code} already exists` });
    }

    const newCourse = await Course.create({
      code,
      name,
      department: department || null,
      credits: credits ? Number(credits) : 3,
      semester: semester ? Number(semester) : 1,
      instructor: req.user.role === 'faculty' ? req.user.id : (req.body.instructor || null),
      description: description || '',
      syllabus: syllabus || '',
      capacity: capacity ? Number(capacity) : 60,
      enrolledStudents: [],
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private (Admin, Faculty)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll current student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found for current user' });
    }

    const enrolled = course.enrolledStudents || [];
    if (enrolled.includes(studentProfile._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    if (enrolled.length >= (course.capacity || 60)) {
      return res.status(400).json({ success: false, message: 'Course is at maximum capacity' });
    }

    enrolled.push(studentProfile._id);
    const updated = await Course.findByIdAndUpdate(req.params.id, { enrolledStudents: enrolled });

    res.status(200).json({
      success: true,
      message: `Enrolled in ${course.name} successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students enrolled in course
// @route   GET /api/courses/:id/students
// @access  Private (Faculty, Admin)
const getCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const studentIds = course.enrolledStudents || [];
    const students = await Student.find({ _id: { $in: studentIds } });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getCourseStudents,
};
