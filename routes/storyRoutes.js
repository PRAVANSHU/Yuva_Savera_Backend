const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");
const { uploadStory } = require("../middleware/uploadMiddleware"); // ✅ destructure
const { protect } = require("../middleware/authMiddleware");


// Story submission route
router.post(
  "/",
  protect,
  uploadStory.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  storyController.createStory
);

// Public routes
router.get("/", storyController.getAllStories);
router.get("/:id", storyController.getStoryById);

// Admin routes
router.get("/admin/pending", storyController.getPendingStories);
router.patch("/:id/status", storyController.updateStoryStatus);

module.exports = router;
