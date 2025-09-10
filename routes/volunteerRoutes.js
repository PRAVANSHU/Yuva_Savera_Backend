const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");


const { uploadFile } = require("../middleware/uploadMiddleware"); 
const { protect, restrictTo } = require("../middleware/authMiddleware");

// ---------------- Public routes ----------------
router.get("/leaderboard", volunteerController.getLeaderboard);

// Volunteer registration with file upload (idProof)
router.post(
  "/register",
  uploadFile.single("idProof"),
  volunteerController.registerVolunteer
);

router.get("/myprofile", protect, volunteerController.getMyProfile)

// ---------------- Protected routes ----------------
router.use(protect);

router.get("/profile/:id", volunteerController.getVolunteerProfile);
router.patch("/profile/:id", volunteerController.updateVolunteerProfile);
router.get("/dashboard", volunteerController.getVolunteerDashboard);

router.use(restrictTo("admin", "core_admin"));
router.post("/add", volunteerController.addNewVolunteer);
router.get("/", volunteerController.getAllVolunteers);


router.patch("/:id/review", volunteerController.updateVolunteerStatus);


router.patch("/:id/toggle", volunteerController.toggleVolunteerStatus);

module.exports = router;
