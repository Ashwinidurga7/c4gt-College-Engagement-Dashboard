const { createModel } = require('./_baseSchema');

const AcademicReport = createModel('AcademicReport', 'academicreports', {
  student: { type: Object },
  rollNumber: { type: String },
  semester: { type: Number },
  academicYear: { type: String },
  courses: { type: Array, default: [] },
  sgpa: { type: Number },
  cgpa: { type: Number },
  backlogs: { type: Number, default: 0 },
});

module.exports = AcademicReport;
