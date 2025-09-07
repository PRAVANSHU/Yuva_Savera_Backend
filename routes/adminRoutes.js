const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Protect all routes
router.use(protect);

// Core Admin only
router.get('/users', restrictTo('core_admin'), adminController.getAllUsers);
router.patch('/users/:id/status', restrictTo('core_admin'), adminController.updateUserStatus);
router.post('/create-admin', restrictTo('core_admin'), adminController.createAdmin);


// District Lead & Core Admin
router.post('/approve-request', restrictTo('district_lead', 'core_admin'), adminController.approveRequest);

// Moderator/District Lead/Core Admin
router.get('/requests', restrictTo('moderator', 'district_lead', 'core_admin'), adminController.viewRequests);

module.exports = router;
