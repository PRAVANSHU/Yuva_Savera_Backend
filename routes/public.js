const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');

// GET /api/public/requests
// Returns all approved requests
router.get('/requests', async (req, res) => {
  try {
    const approvedRequests = await HelpRequest.find({ status: 'Approved' }).sort({ createdAt: -1 });

    // Format for frontend
    const formattedRequests = approvedRequests.map(req => ({
      _id: req._id,
      title: req.title,
      description: req.description,
      category: req.category,
      urgencyLevel: req.urgencyLevel,
      location: req.location?.city || req.location?.address || 'N/A',
      submittedBy: req.submittedBy?.name || 'Anonymous',
      videoUrl: req.media?.video?.url || null,
      videoThumbnail: req.media?.video?.thumbnail || null,
      status: req.status,
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
