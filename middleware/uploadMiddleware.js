const multer = require('multer');

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
    cb(null, true);
  },
}).single('resume');

const UPLOAD_MESSAGES = {
  LIMIT_FILE_SIZE: 'The file must be 5 MB or smaller.',
  LIMIT_UNEXPECTED_FILE: 'Upload one PDF file in the "resume" field.',
};

/**
 * Accepts an optional resume PDF (field "resume") into req.file. JSON requests pass
 * straight through, so resumes can still be created without a file.
 */
const acceptResumeFile = (req, res, next) => {
  resumeUpload(req, res, (err) => {
    if (!err) return next();
    const message = (err instanceof multer.MulterError && UPLOAD_MESSAGES[err.code]) || 'The upload could not be read.';
    res.status(400).json({ success: false, message });
  });
};

module.exports = { acceptResumeFile, MAX_RESUME_BYTES };
