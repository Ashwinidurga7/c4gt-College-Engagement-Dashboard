const { createModel } = require('./_baseSchema');

const Internship = createModel('Internship', 'internships', {
  student: { type: Object },
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String },
  stipend: { type: String },
  status: { type: String, default: 'active' },
});

module.exports = Internship;
