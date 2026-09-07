const express = require('express');
const router = express.Router();
const {
  createCertification,
  getCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
  verifyCertification,
} = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getCertifications)
  .post(authorize('student'), createCertification);

router.route('/:id')
  .get(getCertificationById)
  .put(updateCertification)
  .delete(deleteCertification);

router.route('/:id/verify')
  .put(authorize('faculty', 'admin', 'department_head'), verifyCertification);

module.exports = router;
