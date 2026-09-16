const { createModel } = require('./_baseSchema');

const Worker = createModel('Worker', 'workers', {
  empId: { type: String },
  name: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, default: 'Facilities' },
  campus: { type: String, default: 'KIET' },
  block: { type: String },
  department: { type: String },
  shift: { type: String, default: 'General' },
  contact: { type: String },
  phone: { type: String },
  status: { type: String, default: 'On Duty' },
});

module.exports = Worker;
