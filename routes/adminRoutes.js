const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getPendingVerifications,
  batchApproveActivities,
  getSystemSettings,
  updateSystemSettings,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.get('/pending', getPendingVerifications);
router.post('/activities/batch-approve', batchApproveActivities);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

module.exports = router;
