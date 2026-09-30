const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerHod,
  registerCtpo,
  loginUser,
  getMe,
  updatePassword,
  forgotPassword,
  validateResetToken,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequiredFields } = require('../middleware/validationMiddleware');
const { forgotPasswordLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', validateRequiredFields(['name', 'email', 'password']), registerUser);
router.post('/register/hod', validateRequiredFields(['name', 'email', 'password', 'college', 'department']), registerHod);
router.post('/register/ctpo', validateRequiredFields(['name', 'email', 'password', 'college', 'department']), registerCtpo);
const validateLogin = (req, res, next) => {
  const id = req.body && (req.body.email || req.body.identifier || req.body.rollNumber);
  if (!id || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide roll number / email and password',
    });
  }
  next();
};

router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.get('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;

