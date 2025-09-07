const express = require('express');
const requestController = require('../controllers/requestController');
const upload = require('../middleware/uploadMiddleware'); 
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', requestController.getAllRequests);
router.get('/stats', requestController.getRequestStats);
router.get('/:id', requestController.getRequestById);

// Protected
router.use(protect);

// Create request (with video upload)
router.post(
  '/',
  upload.single("video"),  // ✅ this works now
  requestController.createRequest
);

router.patch('/:id/assign', requestController.assignVolunteer);
router.patch('/:id/status', requestController.updateRequestStatus);

// Admin only
router.use(restrictTo('core_admin', 'district_lead', 'moderator'));
router.patch("/:id/admin-status", requestController.adminApproveReject);

module.exports = router;
