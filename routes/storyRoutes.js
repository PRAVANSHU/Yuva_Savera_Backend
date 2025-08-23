const express = require('express');
const storyController = require('../controllers/storyController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// TODO: Define success story routes
// These routes will handle story creation, management, and display

// Public routes
router.get('/', storyController.getAllStories);
router.get('/featured', storyController.getFeaturedStories);
router.get('/:id', storyController.getStoryById);

// Protected routes
router.use(protect);

// Story management
router.post('/', storyController.createStory);
router.patch('/:id', storyController.updateStory);
router.delete('/:id', storyController.deleteStory);

// TODO: Add these routes when implementing full functionality
// router.get('/my-stories', storyController.getMyStories);
// router.post('/:id/like', storyController.likeStory);
// router.delete('/:id/like', storyController.unlikeStory);
// router.post('/:id/comments', storyController.addComment);
// router.delete('/:id/comments/:commentId', storyController.deleteComment);
// router.post('/:id/share', storyController.shareStory);
// router.post('/:id/report', storyController.reportStory);

// Admin only routes
router.use(restrictTo('admin'));
// router.patch('/:id/approve', storyController.approveStory);
// router.patch('/:id/feature', storyController.featureStory);
// router.patch('/:id/unfeature', storyController.unfeatureStory);
// router.get('/admin/pending', storyController.getPendingStories);

module.exports = router;