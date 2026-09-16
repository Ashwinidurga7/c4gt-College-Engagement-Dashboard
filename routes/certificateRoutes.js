const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  verifyCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getCertificates)
  .post(authorize('student'), createCertificate);

router.route('/:id')
  .get(getCertificateById)
  .put(updateCertificate)
  .delete(deleteCertificate);

router.route('/:id/verify')
  .put(authorize('faculty', 'admin', 'department_head'), verifyCertificate);

module.exports = router;
