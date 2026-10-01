const express = require('express');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
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

// Slows password guessing: 10 failed sign-ins per account per address every 15 minutes.
// Keyed by account as well as address, since a whole campus can share one public IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => {
    const id = req.body && (req.body.email || req.body.identifier || req.body.rollNumber);
    return `${ipKeyGenerator(req.ip)}:${String(id || '').trim().toLowerCase()}`;
  },
  message: { success: false, message: 'Too many failed sign-in attempts. Try again in 15 minutes.' },
});

router.post('/login', loginLimiter, validateLogin, loginUser);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
