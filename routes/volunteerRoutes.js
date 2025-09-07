const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");

// middlewares you forgot to import
const { uploadFile } = require("../middleware/uploadMiddleware"); // adjust path if different
const { protect, restrictTo } = require("../middleware/authMiddleware"); // adjust path if different

// ---------------- Public routes ----------------
router.get("/leaderboard", volunteerController.getLeaderboard);

// Volunteer registration with file upload (idProof)
router.post(
  "/register",
  uploadFile.single("idProof"),
  volunteerController.registerVolunteer
);

// ---------------- Protected routes ----------------
router.use(protect);

// Volunteer profile & dashboard
router.get("/profile/:id", volunteerController.getVolunteerProfile);
router.patch("/profile/:id", volunteerController.updateVolunteerProfile);
router.get("/dashboard", volunteerController.getVolunteerDashboard);

// ---------------- Admin only routes ----------------
router.use(restrictTo("admin", "core_admin"));
router.get("/", volunteerController.getAllVolunteers);

// Approve/Reject (status column)
router.patch("/:id/review", volunteerController.updateVolunteerStatus);

// Activate/Deactivate (action column)
router.patch("/:id/toggle", volunteerController.toggleVolunteerStatus);

module.exports = router;
