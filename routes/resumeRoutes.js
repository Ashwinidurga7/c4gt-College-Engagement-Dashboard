const express = require('express');
const router = express.Router();
const {
  getResumes,
  getMyResume,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  generateResumeData,
  setPrimaryResume,
  getResumeFile,
} = require('../controllers/resumeController');
const {
  getBuilderDraft,
  saveBuilderDraft,
  getBuilderVersions,
  createBuilderVersion,
  deleteBuilderVersion,
} = require('../controllers/resumeBuilderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { acceptResumeFile } = require('../middleware/uploadMiddleware');

// Opened in a new tab, so it is authorised by the signed link in the URL, not the auth header.
router.get('/:id/file', getResumeFile);

router.use(protect);

router.get('/me', authorize('student'), getMyResume);
router.get('/generate', authorize('student'), generateResumeData);

// Resume builder draft and history. These sit above the '/:id' routes so
// 'builder-draft' and 'builder-versions' are not read as a resume id.
router.route('/builder-draft')
  .get(authorize('student'), getBuilderDraft)
  .put(authorize('student'), saveBuilderDraft);

router.route('/builder-versions')
  .get(authorize('student'), getBuilderVersions)
  .post(authorize('student'), createBuilderVersion);

router.delete('/builder-versions/:id', authorize('student'), deleteBuilderVersion);

router.patch('/:id/primary', authorize('student'), setPrimaryResume);

router.route('/')
  .get(getResumes)
  .post(authorize('student'), acceptResumeFile, createResume);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;
