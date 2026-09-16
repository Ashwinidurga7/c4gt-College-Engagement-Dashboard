const { createModel } = require('./_baseSchema');

const Project = createModel('Project', 'projects', {
  student: { type: Object },
  title: { type: String, required: true },
  description: { type: String },
  techStack: { type: Array, default: [] },
  githubUrl: { type: String },
  liveUrl: { type: String },
});

module.exports = Project;
