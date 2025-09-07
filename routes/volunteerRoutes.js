const express = require("express");
const volunteerController = require("../controllers/volunteerController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// ========================
// Public routes
// ========================
router.get("/leaderboard", volunteerController.getLeaderboard);

// ========================
// Protected routes (volunteer must be logged in)
// ========================
router.use(protect);

// Volunteer self-service routes
router.post("/register", volunteerController.registerVolunteer);
router.get("/profile/:id", volunteerController.getVolunteerProfile);
router.patch("/profile/:id", volunteerController.updateVolunteerProfile);
router.get("/dashboard", volunteerController.getVolunteerDashboard);

// ========================
// Admin only routes
// ========================
router.use(restrictTo("admin", "core_admin"));

// Core admin volunteer management
router.get("/", volunteerController.getAllVolunteers); // View all volunteers
router.post("/", volunteerController.addNewVolunteer); // Add new volunteer
router.patch("/:id/status", volunteerController.toggleVolunteerStatus); // Activate/Deactivate volunteer

module.exports = router;
