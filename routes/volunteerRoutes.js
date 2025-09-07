const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

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

module.exports = router;
