const { createModel } = require('./_baseSchema');

const Course = createModel('Course', 'courses', {
  code: { type: String, required: true },
  name: { type: String, required: true },
  credits: { type: Number, default: 3 },
  department: { type: Object },
  semester: { type: Number },
});

module.exports = Course;
