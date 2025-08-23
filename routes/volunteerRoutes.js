const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// TODO: Define volunteer-related routes
// These routes will handle volunteer registration, profile management, and activities

// Public routes
router.get('/leaderboard', volunteerController.getLeaderboard);

// Protected routes
router.use(protect);

// Volunteer registration and profile management
router.post('/register', volunteerController.registerVolunteer);
router.get('/profile/:id', volunteerController.getVolunteerProfile);
router.patch('/profile/:id', volunteerController.updateVolunteerProfile);
router.get('/dashboard', volunteerController.getVolunteerDashboard);

// TODO: Add these routes when implementing full functionality
// router.get('/opportunities', volunteerController.getOpportunities);
// router.post('/apply/:requestId', volunteerController.applyForRequest);
// router.get('/applications', volunteerController.getMyApplications);
// router.patch('/applications/:id/withdraw', volunteerController.withdrawApplication);
// router.get('/contributions', volunteerController.getContributions);
// router.post('/contributions/:id/feedback', volunteerController.submitFeedback);

// Admin only routes
router.use(restrictTo('admin'));
// router.get('/', volunteerController.getAllVolunteers);
// router.patch('/:id/approve', volunteerController.approveVolunteer);
// router.patch('/:id/suspend', volunteerController.suspendVolunteer);
// router.patch('/:id/points', volunteerController.updatePoints);
// router.post('/:id/badges', volunteerController.awardBadge);

module.exports = router;