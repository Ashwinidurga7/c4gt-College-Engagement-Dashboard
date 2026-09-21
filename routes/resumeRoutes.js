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
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/me', authorize('student'), getMyResume);
router.get('/generate', authorize('student'), generateResumeData);

router.patch('/:id/primary', authorize('student'), setPrimaryResume);

router.route('/')
  .get(getResumes)
  .post(authorize('student'), createResume);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;
