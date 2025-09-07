const express = require('express');
const requestController = require('../controllers/requestController');
const {upload} = require('../middleware/uploadMiddleware'); // <-- multer+cloudinary
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { uploadVideo } = require("../middleware/uploadMiddleware");


const router = express.Router();

// Public routes
router.get('/', requestController.getAllRequests);
router.get('/stats', requestController.getRequestStats);
router.get('/:id', requestController.getRequestById);

// Protected routes
router.use(protect);

// Request management
router.post(
  '/',
  uploadVideo.single("video"),       // <-- IMPORTANT: handle video upload
  requestController.createRequest
);

router.patch('/:id/assign', requestController.assignVolunteer);
router.patch('/:id/status', requestController.updateRequestStatus);

// Admin routes
router.use(restrictTo('core_admin', 'district_lead', 'moderator'));
router.patch("/:id/admin-status", requestController.adminApproveReject);

module.exports = router;