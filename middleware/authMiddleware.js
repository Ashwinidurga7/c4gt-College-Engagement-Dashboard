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
  next();
};

const { authorize } = require('./roleMiddleware');

module.exports = { protect, authorize };
