const { createModel } = require('./_baseSchema');

const Evidence = createModel('Evidence', 'evidences', {
  activity: { type: Object },
  fileUrl: { type: String },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = Evidence;
