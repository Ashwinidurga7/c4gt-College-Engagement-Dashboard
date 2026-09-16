const express = require('express');
const router = express.Router();
const { getAdminPlacements, getHodPlacements } = require('../controllers/placementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/admin', protect, getAdminPlacements);
router.get('/hod', protect, getHodPlacements);
router.get('/', protect, (req, res, next) => {
  if (req.user?.role === 'hod') {
    return getHodPlacements(req, res, next);
  }
  return getAdminPlacements(req, res, next);
});

module.exports = router;
