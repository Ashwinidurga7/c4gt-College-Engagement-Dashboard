const { createModel } = require('./_baseSchema');

const Attendance = createModel('Attendance', 'attendances', {
  student: { type: Object },
  rollNumber: { type: String },
  academicYear: { type: String },
  semester: { type: Number },
  overallPercentage: { type: Number, default: 85 },
  monthlyBreakdown: { type: Array, default: [] },
  subjectBreakdown: { type: Array, default: [] },
});

module.exports = Attendance;
