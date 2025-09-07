const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String, required: true },
  skills: {
    type: [String],
    validate: [arr => arr.length > 0, 'At least one skill is required']
  },
  causesOfInterest: {
    type: [String],
    validate: [arr => arr.length > 0, 'At least one cause of interest is required']
  },
  availability: {
    type: String,
    enum: ['weekends', 'evenings', 'flexible', 'full-time'],
    required: true
  },
  experience: { type: String, maxLength: [1000, 'Experience description cannot exceed 1000 characters'] },
  motivation: { type: String, required: true, maxLength: [1000, 'Motivation cannot exceed 1000 characters'] },
  idProof: {
    url: String,
    publicId: String,
    type: { type: String, enum: ['aadhaar', 'driving_license', 'passport'] }
  },
  points: { type: Number, default: 0, min: 0 },
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now },
    description: String
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  contributionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }],

  // 🔹 Status for approval (Core Admin only)
  status: { 
    type: String, 
    enum: ['pending_review', 'approved', 'rejected'], 
    default: 'pending_review' 
  },

  // 🔹 Separate field for activation (Action column)
  isActive: { 
    type: Boolean, 
    default: true 
  },

  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    maxDistance: { type: Number, default: 50 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
volunteerSchema.index({ skills: 1 });
volunteerSchema.index({ causesOfInterest: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ points: -1 });

// Virtual for user details
volunteerSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Auto-populate user info
volunteerSchema.pre(/^find/, function(next) {
  this.populate('user', 'name email phone');
  next();
});

// Methods
volunteerSchema.methods.addPoints = function(points, reason) {
  this.points += points;
  return this.save();
};

volunteerSchema.methods.addBadge = function(badgeName, description) {
  this.badges.push({ name: badgeName, description, earnedAt: new Date() });
  return this.save();
};

module.exports = mongoose.model('Volunteer', volunteerSchema);
