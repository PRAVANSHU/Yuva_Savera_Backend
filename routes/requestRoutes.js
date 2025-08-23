const express = require('express');
const requestController = require('../controllers/requestController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// TODO: Define help request routes
// These routes will handle help request creation, management, and matching

// Public routes (for browsing requests)
router.get('/', requestController.getAllRequests);
router.get('/stats', requestController.getRequestStats);
router.get('/:id', requestController.getRequestById);

// Protected routes
router.use(protect);

// Request management
router.post('/', requestController.createRequest);
router.patch('/:id/assign', requestController.assignVolunteer);
router.patch('/:id/status', requestController.updateRequestStatus);

// TODO: Add these routes when implementing full functionality
// router.get('/my-requests', requestController.getMyRequests);
// router.patch('/:id', requestController.updateRequest);
// router.delete('/:id', requestController.deleteRequest);
// router.post('/:id/interest', requestController.expressInterest);
// router.delete('/:id/interest', requestController.withdrawInterest);
// router.get('/:id/interested-volunteers', requestController.getInterestedVolunteers);
// router.post('/:id/feedback', requestController.submitFeedback);
// router.get('/nearby', requestController.getNearbyRequests);

// Admin only routes
router.use(restrictTo('admin'));
// router.patch('/:id/verify', requestController.verifyRequest);
// router.patch('/:id/feature', requestController.featureRequest);
// router.get('/admin/pending', requestController.getPendingRequests);

module.exports = router;