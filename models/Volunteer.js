const mongoose = require('mongoose');

// TODO: Define Volunteer schema extending User data
const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    type: String,
    required: true
  }],
  causesOfInterest: [{
    type: String,
    required: true
  }],
  availability: {
    type: String,
    enum: ['weekends', 'evenings', 'flexible', 'full-time'],
    required: true
  },
  experience: {
    type: String,
    maxLength: [1000, 'Experience description cannot exceed 1000 characters']
  },
  motivation: {
    type: String,
    required: [true, 'Motivation is required'],
    maxLength: [1000, 'Motivation cannot exceed 1000 characters']
  },
  idProof: {
    url: String,
    publicId: String,
    type: String // 'aadhaar', 'driving_license', 'passport'
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  contributionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  }],
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'suspended', 'inactive'],
    default: 'pending_review'
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    maxDistance: {
      type: Number,
      default: 50 // kilometers
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
volunteerSchema.index({ userId: 1 });
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

// Method to add points
volunteerSchema.methods.addPoints = function(points, reason) {
  this.points += points;
  // TODO: Add to contribution history
  return this.save();
};

// Method to add badge
volunteerSchema.methods.addBadge = function(badgeName, description) {
  this.badges.push({
    name: badgeName,
    description: description,
    earnedAt: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Volunteer', volunteerSchema);