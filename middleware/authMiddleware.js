const jwt = require('jsonwebtoken');
const User = require('../models/User');

// TODO: Implement authentication middleware
// This middleware will handle JWT token verification and user authentication

const protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verify token
    // TODO: Implement actual JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    // TODO: Fetch user from database
    // const currentUser = await User.findById(decoded.id);

    // For now, return dummy user data
    req.user = {
      id: 'dummy-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'volunteer'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again!'
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // TODO: Check if user role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// TODO: Add these middleware functions
const optionalAuth = async (req, res, next) => {
  // Similar to protect but doesn't require authentication
  // Used for routes that work differently for authenticated users
  next();
};

const verifyEmail = async (req, res, next) => {
  // Check if user's email is verified
  next();
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
  verifyEmail
};