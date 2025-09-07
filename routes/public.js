const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');

// GET /api/public/requests
// Returns all public and admin-approved requests
router.get('/requests', async (req, res) => {
  try {
    // Fetch requests that are public and approved by admin
    const approvedRequests = await HelpRequest.find({ 
      adminStatus: 'approved', 
      isPublic: true 
    }).sort({ createdAt: -1 });

    // Format the response for frontend
    const formattedRequests = approvedRequests.map(req => ({
      _id: req._id,
      title: req.title,
      description: req.description,
      category: req.category,
      urgencyLevel: req.urgencyLevel,
      location: {
        address: req.location?.address || 'N/A',
        city: req.location?.city || 'N/A',
      },
      submittedBy: {
        name: req.submittedBy?.name || 'Anonymous',
        anonymous: req.submittedBy?.anonymous || false,
      },
      videoUrl: req.media?.video?.url || null,
      videoThumbnail: req.media?.video?.thumbnail || null,
      status: req.status || 'Open',           // user-side status
      adminStatus: req.adminStatus || 'approved', // admin-side status
      createdAt: req.createdAt
    }));

    res.status(200).json({
      status: 'success',
      results: formattedRequests.length,
      requests: formattedRequests,
    });

  } catch (err) {
    console.error('Error fetching approved requests:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
