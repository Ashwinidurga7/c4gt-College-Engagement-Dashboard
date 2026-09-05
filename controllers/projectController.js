const Project = require('../models/Project');
const Student = require('../models/Student');

// @desc    Get all projects (filtered by student, status, technology)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let projects = await Project.find();

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      projects = projects.filter((p) => String(p.student) === String(studentProfile._id));
    } else if (req.query.studentId) {
      projects = projects.filter((p) => String(p.student) === String(req.query.studentId));
    }

    if (req.query.status) {
      projects = projects.filter((p) => p.status === req.query.status);
    }

    if (req.query.technology) {
      const tech = req.query.technology.toLowerCase();
      projects = projects.filter(
        (p) =>
          Array.isArray(p.technologies) &&
          p.technologies.some((t) => t.toLowerCase().includes(tech))
      );
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Student)
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      startDate,
      endDate,
      status,
      teamMembers,
      guideFaculty,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found for current user' });
    }

    const techList = Array.isArray(technologies)
      ? technologies
      : (technologies ? technologies.split(',').map((t) => t.trim()) : []);

    const team = Array.isArray(teamMembers)
      ? teamMembers
      : (teamMembers ? teamMembers.split(',').map((m) => m.trim()) : [req.user.name || 'Author']);

    const newProject = await Project.create({
      student: studentProfile._id,
      title,
      description: description || '',
      technologies: techList,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      status: status || 'ongoing',
      teamMembers: team,
      guideFaculty: guideFaculty || null,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updateData = { ...req.body };
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map((t) => t.trim());
    }
    if (updateData.teamMembers && typeof updateData.teamMembers === 'string') {
      updateData.teamMembers = updateData.teamMembers.split(',').map((m) => m.trim());
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
