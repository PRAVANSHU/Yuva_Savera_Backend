const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { uploadFile } = require('../middleware/uploadMiddleware');

const router = express.Router();

// ---------------- Public routes ----------------
router.get('/leaderboard', volunteerController.getLeaderboard);

// Volunteer registration with file upload (idProof)
router.post('/register', uploadFile.single('idProof'), volunteerController.registerVolunteer);

// ---------------- Protected routes ----------------
router.use(protect);

// Volunteer profile & dashboard
router.get('/profile/:id', volunteerController.getVolunteerProfile);
router.patch('/profile/:id', volunteerController.updateVolunteerProfile);
router.get('/dashboard', volunteerController.getVolunteerDashboard);

// ---------------- Future features (commented for now) ----------------
// router.get('/opportunities', volunteerController.getOpportunities);
// router.post('/apply/:requestId', volunteerController.applyForRequest);
// router.get('/applications', volunteerController.getMyApplications);
// router.patch('/applications/:id/withdraw', volunteerController.withdrawApplication);
// router.get('/contributions', volunteerController.getContributions);
// router.post('/contributions/:id/feedback', volunteerController.submitFeedback);

// ---------------- Admin only routes ----------------
router.use(restrictTo('admin', 'core_admin'));
router.get('/', volunteerController.getAllVolunteers);

// Approve/Reject (status column)
router.patch('/:id/review', volunteerController.updateVolunteerStatus);

// Activate/Deactivate (action column)
router.patch('/:id/toggle', volunteerController.toggleVolunteerStatus);
// router.patch('/:id/approve', volunteerController.approveVolunteer);
// router.patch('/:id/suspend', volunteerController.suspendVolunteer);
// router.patch('/:id/points', volunteerController.updatePoints);
// router.post('/:id/badges', volunteerController.awardBadge);

module.exports = router;
