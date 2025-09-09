const Campaign = require('../models/Campaign');

// Upload image route (used by frontend first to upload file to Cloudinary via multer-storage)
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // multer-storage-cloudinary provides a path/secure_url on req.file
    const imageUrl = req.file.path || req.file.secure_url || req.file.url || (req.file && req.file.filename) || '';

    return res.status(201).json({ success: true, imageUrl });
  } catch (err) {
    next(err);
  }
};

// Create campaign proposal (expects JSON body, NOT multipart)
// { title, description, startDate, endDate, location, participantsCount, imageUrl }
exports.createProposal = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, location, participantsCount, imageUrl } = req.body;

    if (!title || !description || !startDate || !endDate || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const campaign = new Campaign({
      title: title.trim(),
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      participantsCount: participantsCount ? Number(participantsCount) : 0,
      imageUrl: imageUrl || '',
      status: 'pending',
      createdBy: req.user ? req.user._id : undefined
    });

    await campaign.save();
    res.status(201).json({ success: true, message: 'Proposal submitted successfully. Pending admin approval.', campaign });
  } catch (err) {
    next(err);
  }
};

// Public: fetch only approved campaigns and attach lifecycle (Upcoming | Active | Completed)
exports.getApprovedCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ status: 'approved' }).sort({ startDate: 1 }).lean();
    const now = new Date();

    const formatted = campaigns.map(c => {
      let lifecycle = 'Upcoming';
      if (new Date(c.startDate) <= now && new Date(c.endDate) >= now) lifecycle = 'Active';
      else if (new Date(c.endDate) < now) lifecycle = 'Completed';
      return { ...c, lifecycle };
    });

    return res.json({ success: true, campaigns: formatted });
  } catch (err) {
    next(err);
  }
};

// Admin: fetch pending proposals (status === 'pending')
// protect + restrictTo middleware will be applied in routes
exports.getProposals = async (req, res, next) => {
  try {
    const proposals = await Campaign.find({ status: 'pending' }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, campaigns: proposals });
  } catch (err) {
    next(err);
  }
};

// Admin: approve a campaign (set status -> approved)
exports.approveCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

    campaign.status = 'approved';
    await campaign.save();

    // optional: compute lifecycle to be returned
    const now = new Date();
    let lifecycle = 'Upcoming';
    if (new Date(campaign.startDate) <= now && new Date(campaign.endDate) >= now) lifecycle = 'Active';
    else if (new Date(campaign.endDate) < now) lifecycle = 'Completed';

    res.json({ success: true, message: 'Campaign approved', campaign: { ...campaign.toObject(), lifecycle } });
  } catch (err) {
    next(err);
  }
};

// Admin: delete campaign
exports.deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Campaign deleted', campaign });
  } catch (err) {
    next(err);
  }
};
