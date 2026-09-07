const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerHod,
  registerCtpo,
  loginUser,
  getMe,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequiredFields } = require('../middleware/validationMiddleware');

router.post('/register', validateRequiredFields(['name', 'email', 'password']), registerUser);
router.post('/register/hod', validateRequiredFields(['name', 'email', 'password', 'college', 'department']), registerHod);
router.post('/register/ctpo', validateRequiredFields(['name', 'email', 'password', 'college', 'department']), registerCtpo);
router.post('/login', validateRequiredFields(['email', 'password']), loginUser);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
