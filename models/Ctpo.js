const { createModel } = require('./_baseSchema');

const Ctpo = createModel('Ctpo', 'ctpos', {
  user: { type: Object },
  employeeId: { type: String },
  college: { type: String, default: 'KIET' },
  department: { type: Object },
  academicYear: { type: String },
  year: { type: String },
  section: { type: String },
  approvalStatus: { type: String, default: 'approved' },
  isActive: { type: Boolean, default: true },
});

module.exports = Ctpo;
