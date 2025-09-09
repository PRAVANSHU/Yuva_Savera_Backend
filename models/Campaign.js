const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  participantsCount: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" }, // store cloudinary url here
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // approval state (admin uses this)
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
