const { createModel } = require('./_baseSchema');

const Certificate = createModel('Certificate', 'certificates', {
  student: { type: Object },
  certificateNumber: { type: String },
  title: { type: String, required: true },
  issuingAuthority: { type: String },
  issueDate: { type: Date },
  verificationStatus: { type: String, default: 'verified' },
});

module.exports = Certificate;
