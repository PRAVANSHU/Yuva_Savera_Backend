const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { uploadCampaign } = require('../middleware/uploadMiddleware'); // your cloudinary multer-storage
const { protect, restrictTo } = require('../middleware/authMiddleware'); // use your existing auth middleware

// upload image -> returns { imageUrl }
router.post('/upload-image', uploadCampaign.single('image'), campaignController.uploadImage);

// create proposal (expects JSON, not multipart)
router.post('/', campaignController.createProposal);

// public: fetch approved campaigns (with lifecycle)
router.get('/', campaignController.getApprovedCampaigns);

// admin only routes (protect + restrict)
router.get('/proposals', protect, restrictTo('core_admin'), campaignController.getProposals);
router.put('/:id/approve', protect, restrictTo('core_admin'), campaignController.approveCampaign);
router.delete('/:id', protect, restrictTo('core_admin'), campaignController.deleteCampaign);

module.exports = router;
