const { createModel } = require('./_baseSchema');

const Department = createModel('Department', 'departments', {
  name: { type: String, required: true },
  code: { type: String, required: true },
  college: { type: String, default: 'KIET' },
  headOfDepartment: { type: String },
});

module.exports = Department;
