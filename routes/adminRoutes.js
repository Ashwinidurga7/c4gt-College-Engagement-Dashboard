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
  getPendingFaculty,
  approveFaculty,
  rejectFaculty,
  getPendingHods,
  approveHod,
  rejectHod,
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

// Faculty Registration Approval Endpoints
router.get('/faculty/pending', getPendingFaculty);
router.put('/faculty/:id/approve', approveFaculty);
router.put('/faculty/:id/reject', rejectFaculty);

// HOD Registration Approval Endpoints
router.get('/hods/pending', getPendingHods);
router.put('/hods/:id/approve', approveHod);
router.put('/hods/:id/reject', rejectHod);

module.exports = router;
