const express = require("express");
const storyController = require("../controllers/storyController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/", storyController.getAllStories);
router.get("/:id", storyController.getStoryById);

// Protected: User submits story
router.post(
  "/",
  protect,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  storyController.createStory
);

// Admin routes
router.get("/admin/pending", protect, restrictTo("core_admin"), storyController.getPendingStories);
router.patch("/admin/:id/status", protect, restrictTo("core_admin"), storyController.updateStoryStatus);

module.exports = router;
