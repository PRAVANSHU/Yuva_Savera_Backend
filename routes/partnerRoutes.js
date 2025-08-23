const express = require('express');
const partnerController = require('../controllers/partnerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// TODO: Define partner organization routes
// These routes will handle partner registration, management, and collaboration

// Public routes
router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);

// Protected routes
router.use(protect);

// Partner registration and management
router.post('/register', partnerController.registerPartner);
router.patch('/profile/:id', partnerController.updatePartnerProfile);
router.get('/dashboard/:id', partnerController.getPartnerDashboard);

// TODO: Add these routes when implementing full functionality
// router.get('/my-partnerships', partnerController.getMyPartnerships);
// router.post('/collaborate/:partnerId', partnerController.initiateCollaboration);
// router.get('/opportunities', partnerController.getCollaborationOpportunities);
// router.post('/campaigns', partnerController.createCampaign);
// router.get('/campaigns', partnerController.getMyCampaigns);
// router.patch('/campaigns/:id', partnerController.updateCampaign);

// Admin only routes
router.use(restrictTo('admin'));
// router.patch('/:id/approve', partnerController.approvePartner);
// router.patch('/:id/verify', partnerController.verifyPartner);
// router.patch('/:id/suspend', partnerController.suspendPartner);
// router.get('/admin/pending', partnerController.getPendingPartners);
// router.patch('/:id/metrics', partnerController.updatePartnerMetrics);

module.exports = router;