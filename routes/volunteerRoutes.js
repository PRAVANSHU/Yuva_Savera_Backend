const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ---------------- Public routes ----------------
router.get('/leaderboard', volunteerController.getLeaderboard);

// ✅ Volunteer registration should be PUBLIC
router.post(
  '/register',
  upload.single('idProof'),
  volunteerController.registerVolunteer
);

// ---------------- Protected routes ----------------
router.use(protect);

router.get('/profile/:id', volunteerController.getVolunteerProfile);
router.patch('/profile/:id', volunteerController.updateVolunteerProfile);
router.get('/dashboard', volunteerController.getVolunteerDashboard);

module.exports = router;
