const { createModel } = require('./_baseSchema');

const Fee = createModel('Fee', 'fees', {
  user: { type: Object },
  student: { type: Object },
  rollNumber: { type: String },
  academicYear: { type: String, default: '2026–27' },
  total: { type: Number, default: 98000 },
  paid: { type: Number, default: 98000 },
  due: { type: Number, default: 0 },
  dueDate: { type: String, default: '30 Sep 2026' },
  status: { type: String, default: 'Paid' },
  tuition: { type: Number, default: 75000 },
  specialFee: { type: Number, default: 15000 },
  examFee: { type: Number, default: 8000 },
  history: { type: Array, default: [] },
});

module.exports = Fee;
