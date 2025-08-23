const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// TODO: Define authentication routes
// These routes will handle user authentication and account management

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// TODO: Add these routes when implementing full authentication
// router.post('/forgot-password', authController.forgotPassword);
// router.patch('/reset-password/:token', authController.resetPassword);
// router.post('/verify-email/:token', authController.verifyEmail);
// router.post('/resend-verification', authController.resendVerification);

// Protected routes (require authentication)
router.use(protect); // Apply auth middleware to all routes below

router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);

// TODO: Add these protected routes
// router.patch('/update-profile', authController.updateProfile);
// router.delete('/delete-account', authController.deleteAccount);
// router.post('/logout', authController.logout);

module.exports = router;