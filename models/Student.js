const { createModel } = require('./_baseSchema');

const Student = createModel('Student', 'students', {
  rollNumber: { type: String, trim: true },
  user: { type: Object },
  college: { type: String, default: 'KIET' },
  department: { type: Object },
  branch: { type: String },
  batch: { type: String },
  semester: { type: Number },
  year: { type: String },
  section: { type: String },
  cgpa: { type: Number },
  attendance: { type: Number },
  results: { type: Array, default: [] },
});

module.exports = Student;
