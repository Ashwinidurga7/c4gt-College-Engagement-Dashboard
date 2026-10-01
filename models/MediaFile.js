const { createModel } = require('./_baseSchema');

// Uploaded files other than resumes: event and club photos (public) and certificate
// files (private, opened through a signed link). Each file is capped at 5 MB.
const MediaFile = createModel('MediaFile', 'mediafiles', {
  owner: { type: String, index: true },
  purpose: { type: String },
  isPrivate: { type: Boolean, default: false },
  fileName: { type: String },
  contentType: { type: String, required: true },
  size: { type: Number },
  data: { type: Buffer, required: true },
});

module.exports = MediaFile;
