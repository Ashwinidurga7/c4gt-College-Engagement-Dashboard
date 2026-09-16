const express = require('express');
const router = express.Router();
const { getAdminWorkers, addWorker } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getAdminWorkers);
router.post('/', protect, authorize('admin'), addWorker);

module.exports = router;
