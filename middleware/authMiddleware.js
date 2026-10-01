const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Only a missing or invalid token is a 401 (the frontend signs the user out on 401).
// A database error while loading the user is a 500, so a brief outage does not end sessions.
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }

  try {
    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    return next(error);
  }
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  // An account still on its issued password (e.g. a roll number) can only read itself
  // and change the password until it has done so.
  if (req.user.mustChangePassword && !PASSWORD_CHANGE_ROUTES.includes(req.originalUrl.split('?')[0])) {
    return res.status(403).json({
      success: false,
      code: 'PASSWORD_CHANGE_REQUIRED',
      message: 'Set a new password to continue.',
    });
  }
  next();
};

const PASSWORD_CHANGE_ROUTES = ['/api/auth/me', '/api/auth/updatepassword'];

const { authorize } = require('./roleMiddleware');

module.exports = { protect, authorize };
