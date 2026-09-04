const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequiredFields } = require('../middleware/validationMiddleware');

router.post('/register', validateRequiredFields(['name', 'email', 'password']), registerUser);
router.post('/login', validateRequiredFields(['email', 'password']), loginUser);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
