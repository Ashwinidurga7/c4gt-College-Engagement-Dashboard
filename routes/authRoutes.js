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
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
