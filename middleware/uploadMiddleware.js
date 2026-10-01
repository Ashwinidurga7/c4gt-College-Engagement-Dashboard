const multer = require('multer');

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_RESUME_BYTES = MAX_FILE_BYTES;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CERTIFICATE_TYPES = ['application/pdf', ...PHOTO_TYPES];
const MAX_PHOTOS = 10;

/** A multer handler that keeps files in memory and only accepts `types`. */
const uploader = (types, limits) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_BYTES, ...limits },
    fileFilter: (req, file, cb) => {
      if (!types.includes(file.mimetype)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      }
      cb(null, true);
    },
  });

/** Wraps a multer handler so upload problems answer 400 with a readable message. */
const withMessages = (handler, wrongFileMessage) => (req, res, next) => {
  handler(req, res, (err) => {
    if (!err) return next();
    const messages = {
      LIMIT_FILE_SIZE: 'Each file must be 5 MB or smaller.',
      LIMIT_FILE_COUNT: `Add at most ${MAX_PHOTOS} photos.`,
      LIMIT_UNEXPECTED_FILE: wrongFileMessage,
    };
    const message = (err instanceof multer.MulterError && messages[err.code]) || 'The upload could not be read.';
    res.status(400).json({ success: false, message });
  });
};

/**
 * Accepts an optional resume PDF (field "resume") into req.file. JSON requests pass
 * straight through, so resumes can still be created without a file.
 */
const acceptResumeFile = withMessages(
  uploader(['application/pdf'], { files: 1 }).single('resume'),
  'Upload one PDF file in the "resume" field.'
);

/** Event and club photos: up to 10 JPG, PNG or WebP files in "images" (req.files). */
const acceptPhotos = withMessages(
  uploader(PHOTO_TYPES, { files: MAX_PHOTOS }).array('images', MAX_PHOTOS),
  'Photos must be JPG, PNG or WebP.'
);

/** A certificate's proof: one PDF, JPG, PNG or WebP file in "certificate" (req.file). */
const acceptCertificateFile = withMessages(
  uploader(CERTIFICATE_TYPES, { files: 1 }).single('certificate'),
  'Upload the certificate as a PDF, JPG, PNG or WebP file.'
);

module.exports = { acceptResumeFile, acceptPhotos, acceptCertificateFile, MAX_RESUME_BYTES };
