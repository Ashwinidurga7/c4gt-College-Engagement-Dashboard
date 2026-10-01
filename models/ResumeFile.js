const { createModel } = require('./_baseSchema');

// The bytes of an uploaded resume PDF, kept apart from the resume record so listing
// resumes never loads file contents. Uploads are capped at 5 MB.
const ResumeFile = createModel('ResumeFile', 'resumefiles', {
  user: { type: String, required: true, index: true },
  contentType: { type: String, default: 'application/pdf' },
  size: { type: Number },
  data: { type: Buffer, required: true },
});

module.exports = ResumeFile;
