const Resume = require('../models/Resume');
const Student = require('../models/Student');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const Internship = require('../models/Internship');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// @desc    Get all resumes (filtered by student)
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    let resumes = await Resume.find();

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      resumes = resumes.filter((r) => String(r.student) === String(studentProfile._id));
    } else if (req.query.studentId) {
      resumes = resumes.filter((r) => String(r.student) === String(req.query.studentId));
    }

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's default/primary resume
// @route   GET /api/resumes/me
// @access  Private (Student)
const getMyResume = async (req, res, next) => {
  try {
    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const resumes = await Resume.find({ student: studentProfile._id });
    const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];

    if (!defaultResume) {
      return res.status(404).json({ success: false, message: 'No resume found for student' });
    }

    res.status(200).json({ success: true, data: defaultResume });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private (Student)
const createResume = async (req, res, next) => {
  try {
    const { title, summary, skills, education, experience, projects, certifications, template, isDefault } = req.body;

    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found for logged in user' });
    }

    if (isDefault) {
      // Unset previous default resumes
      const existing = await Resume.find({ student: studentProfile._id });
      for (const r of existing) {
        if (r.isDefault) {
          await Resume.findByIdAndUpdate(r._id, { isDefault: false });
        }
      }
    }

    const newResume = await Resume.create({
      student: studentProfile._id,
      title: title || `${req.user.name || 'Student'} Resume`,
      summary: summary || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      projects: Array.isArray(projects) ? projects : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      template: template || 'modern',
      isDefault: isDefault === true,
      fileUrl: null,
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: newResume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (req.body.isDefault) {
      const existing = await Resume.find({ student: resume.student });
      for (const r of existing) {
        if (r.isDefault && String(r._id) !== String(req.params.id)) {
          await Resume.findByIdAndUpdate(r._id, { isDefault: false });
        }
      }
    }

    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-generate structured resume dataset from student profile and verified records
// @route   GET /api/resumes/generate
// @access  Private (Student)
const generateResumeData = async (req, res, next) => {
  try {
    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const user = await User.findById(req.user.id);
    const projects = await Project.find({ student: studentProfile._id });
    const certificates = await Certificate.find({ student: studentProfile._id });
    const activities = await Activity.find({ student: studentProfile._id, status: 'approved' });
    const internships = await Internship.find({ student: studentProfile._id });
    const achievements = await Achievement.find({ student: studentProfile._id });

    // Aggregate extracted skills from verified projects and certificates
    const allSkills = new Set();
    projects.forEach((p) => {
      if (Array.isArray(p.technologies)) p.technologies.forEach((t) => allSkills.add(t));
    });
    certificates.forEach((c) => {
      if (Array.isArray(c.skills)) c.skills.forEach((s) => allSkills.add(s));
    });

    const compiledResume = {
      personalInfo: {
        name: user ? user.name : 'Student Name',
        email: user ? user.email : '',
        rollNumber: studentProfile.rollNumber,
        department: studentProfile.department ? (studentProfile.department.name || studentProfile.department) : '',
        batch: studentProfile.batch,
        semester: studentProfile.semester,
        cgpa: studentProfile.cgpa,
        phoneNumber: studentProfile.phoneNumber || '',
      },
      skills: Array.from(allSkills),
      education: [
        {
          institution: 'College of Engineering & Technology',
          degree: `B.Tech in ${studentProfile.department ? (studentProfile.department.name || studentProfile.department.code || 'Engineering') : 'Engineering'}`,
          batch: studentProfile.batch,
          cgpa: studentProfile.cgpa,
        },
      ],
      internships: internships.map((i) => ({
        companyName: i.companyName,
        role: i.role,
        mode: i.mode,
        duration: `${i.startDate ? new Date(i.startDate).toLocaleDateString() : ''} - ${i.endDate ? new Date(i.endDate).toLocaleDateString() : 'Present'}`,
        status: i.status,
      })),
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        status: p.status,
      })),
      certifications: certificates.map((c) => ({
        title: c.title,
        issuingOrganization: c.issuingOrganization,
        issueDate: c.issueDate,
        credentialId: c.credentialId,
        status: c.status,
      })),
      achievements: achievements.map((a) => ({
        title: a.title,
        category: a.category,
        position: a.position,
        date: a.date,
      })),
      approvedActivitiesCount: activities.length,
      generatedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      data: compiledResume,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResumes,
  getMyResume,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  generateResumeData,
};
