const { createModel } = require('./_baseSchema');

const Hod = createModel('Hod', 'hods', {
  user: { type: Object },
  employeeId: { type: String },
  college: { type: String, default: 'KIET' },
  department: { type: Object },
  academicYear: { type: String },
  year: { type: String },
  designation: { type: String, default: 'Head of Department' },
  approvalStatus: { type: String, default: 'approved' },
  isActive: { type: Boolean, default: true },
});

module.exports = Hod;
