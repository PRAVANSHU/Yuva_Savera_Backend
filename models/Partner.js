const mongoose = require('mongoose');

// TODO: Define Partner schema for partner organizations
const partnerSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxLength: [200, 'Organization name cannot exceed 200 characters']
  },
  organizationType: {
    type: String,
    required: [true, 'Organization type is required'],
    enum: [
      'Non-Governmental Organization (NGO)',
      'Corporate/Private Company',
      'Educational Institution',
      'Government Agency',
      'Social Enterprise',
      'Community Group',
      'Religious Organization'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  focusAreas: [{
    type: String,
    required: true,
    enum: [
      'Education & Skill Development',
      'Healthcare & Medical Services',
      'Employment & Livelihood',
      'Mental Health & Counseling',
      'Environment & Sustainability',
      'Women Empowerment',
      'Child Welfare',
      'Senior Citizen Care',
      'Disability Support',
      'Rural Development',
      'Technology & Innovation',
      'Arts & Culture'
    ]
  }],
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
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    designation: String
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid website URL']
  },
  registrationNumber: String,
  registrationDocument: {
    url: String,
    publicId: String
  },
  logo: {
    url: String,
    publicId: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'suspended', 'rejected'],
    default: 'pending_review'
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'verified', 'premium'],
    default: 'unverified'
  },
  partnerships: [{
    type: {
      type: String,
      enum: ['collaboration', 'resource_sharing', 'joint_campaign', 'funding']
    },
    description: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    }
  }],
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  metrics: {
    volunteersReached: {
      type: Number,
      default: 0
    },
    projectsCompleted: {
      type: Number,
      default: 0
    },
    beneficiariesServed: {
      type: Number,
      default: 0
    },
    totalCollaborations: {
      type: Number,
      default: 0
    }
  },
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
  additionalInfo: String,
  adminNotes: String,
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
partnerSchema.index({ organizationType: 1 });
partnerSchema.index({ focusAreas: 1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ verificationStatus: 1 });
partnerSchema.index({ 'location.coordinates': '2dsphere' });
partnerSchema.index({ 'contactPerson.email': 1 });

// Virtual for active partnerships count
partnerSchema.virtual('activePartnershipsCount').get(function() {
  return this.partnerships.filter(p => p.status === 'active').length;
});

// Method to add partnership
partnerSchema.methods.addPartnership = function(partnershipData) {
  this.partnerships.push(partnershipData);
  this.metrics.totalCollaborations += 1;
  return this.save();
};

// Method to update metrics
partnerSchema.methods.updateMetrics = function(metrics) {
  Object.assign(this.metrics, metrics);
  return this.save();
};

// Static method to find partners by focus area
partnerSchema.statics.findByFocusArea = function(focusArea) {
  return this.find({
    focusAreas: focusArea,
    status: 'approved'
  });
};

// Static method to find nearby partners
partnerSchema.statics.findNearby = function(coordinates, maxDistance = 100000) {
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
    status: 'approved'
  });
};

module.exports = mongoose.model('Partner', partnerSchema);