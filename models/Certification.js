const { createModel } = require('./_baseSchema');

const Certification = createModel('Certification', 'certifications', {
  student: { type: Object },
  title: { type: String, required: true },
  issuer: { type: String },
  issueDate: { type: Date },
  credentialUrl: { type: String },
  status: { type: String, default: 'approved' },
});

module.exports = Certification;
