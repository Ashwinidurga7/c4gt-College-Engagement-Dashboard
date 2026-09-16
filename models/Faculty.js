const { createModel } = require('./_baseSchema');

const Faculty = createModel('Faculty', 'faculties', {
  user: { type: Object },
  employeeId: { type: String },
  college: { type: String, default: 'KIET' },
  department: { type: Object },
  designation: { type: String },
  assignedYears: { type: Array, default: [] },
  approvalStatus: { type: String, default: 'approved' },
  isActive: { type: Boolean, default: true },
});

module.exports = Faculty;
