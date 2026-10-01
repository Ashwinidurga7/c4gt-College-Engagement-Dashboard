const express = require('express');
const router = express.Router();
const {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  toggleClubStatus,
  activateClub,
  deactivateClub,
  updateClubPhotos,
} = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { acceptPhotos } = require('../middleware/uploadMiddleware');

// All club routes require authentication
router.use(protect);

// GET /api/clubs: accessible to all authenticated users (students see all active clubs across all 3 colleges)
// POST /api/clubs: Admin only (manage/create clubs)
router.route('/')
  .get(getClubs)
  .post(authorize('admin'), createClub);

// Club details, update, delete
router.route('/:id')
  .get(getClubById)
  .put(authorize('admin'), updateClub)
  .delete(authorize('admin'), deleteClub);

// Activate / Deactivate status management for Admin
router.patch('/:id/status', authorize('admin'), toggleClubStatus);
router.put('/:id/activate', authorize('admin'), activateClub);
router.put('/:id/deactivate', authorize('admin'), deactivateClub);
router.put('/:id/photos', authorize('admin'), acceptPhotos, updateClubPhotos);

module.exports = router;
