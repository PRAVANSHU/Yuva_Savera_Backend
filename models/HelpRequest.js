const mongoose = require('mongoose');

// TODO: Define HelpRequest schema for managing help requests
const helpRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Education', 'Healthcare', 'Employment', 'Counseling', 'Emergency']
  },
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  urgencyLevel: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  submittedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  media: {
    video: {
      url: String,
      publicId: String,
      thumbnail: String
    },
    images: [{
      url: String,
      publicId: String
    }]
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled'],
    default: 'Open'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  assignedAt: Date,
  resolvedAt: Date,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  tags: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  interestedVolunteers: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    message: String
  }],
  adminNotes: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
helpRequestSchema.index({ category: 1 });
helpRequestSchema.index({ status: 1 });
helpRequestSchema.index({ urgencyLevel: 1 });
helpRequestSchema.index({ 'location.coordinates': '2dsphere' });
helpRequestSchema.index({ createdAt: -1 });
helpRequestSchema.index({ assignedVolunteer: 1 });

// Virtual for time since creation
helpRequestSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
});

// Method to assign volunteer
helpRequestSchema.methods.assignVolunteer = function(volunteerId) {
  this.assignedVolunteer = volunteerId;
  this.assignedAt = new Date();
  this.status = 'In Progress';
  return this.save();
};

// Method to mark as resolved
helpRequestSchema.methods.markResolved = function(feedback) {
  this.status = 'Resolved';
  this.resolvedAt = new Date();
  if (feedback) {
    this.feedback = {
      ...feedback,
      submittedAt: new Date()
    };
  }
  return this.save();
};

// Static method to find nearby requests
helpRequestSchema.statics.findNearby = function(coordinates, maxDistance = 50000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: 'Open'
  });
};

module.exports = mongoose.model('HelpRequest', helpRequestSchema);