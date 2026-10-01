const { createModel } = require('./_baseSchema');

const Resume = createModel('Resume', 'resumes', {
  student: { type: Object },
  rollNumber: { type: String },
  template: { type: String, default: 'modern' },
  summary: { type: String },
  education: { type: Array, default: [] },
  skills: { type: Array, default: [] },
  projects: { type: Array, default: [] },
  experience: { type: Array, default: [] },
  certifications: { type: Array, default: [] },
  title: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  size: { type: Number },
  fileId: { type: String },
  uploadedAt: { type: Date },
  isPrimary: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
});

module.exports = Resume;
