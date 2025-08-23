const mongoose = require('mongoose');

// TODO: Define Story schema for success stories
const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [3000, 'Description cannot exceed 3000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Education', 'Healthcare', 'Employment', 'Counseling', 'Environment', 'Other']
  },
  volunteer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  helpSeeker: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    anonymous: {
      type: Boolean,
      default: false
    }
  },
  relatedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HelpRequest'
  },
  impactMetrics: {
    type: String,
    required: [true, 'Impact metrics are required'],
    maxLength: [500, 'Impact metrics cannot exceed 500 characters']
  },
  media: {
    beforeImages: [{
      url: String,
      publicId: String,
      caption: String
    }],
    afterImages: [{
      url: String,
      publicId: String,
      caption: String
    }],
    videos: [{
      url: String,
      publicId: String,
      thumbnail: String,
      caption: String
    }]
  },
  timeline: [{
    date: Date,
    milestone: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'featured', 'archived'],
    default: 'pending_review'
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date,
  publishedAt: Date,
  likes: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxLength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  location: {
    city: String,
    state: String
  },
  viewCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  adminNotes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
storySchema.index({ category: 1 });
storySchema.index({ status: 1 });
storySchema.index({ featured: 1 });
storySchema.index({ publishedAt: -1 });
storySchema.index({ 'volunteer.id': 1 });
storySchema.index({ 'likes.count': -1 });

// Virtual for reading time estimation
storySchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.description.split(' ').length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
});

// Method to add like
storySchema.methods.addLike = function(userId) {
  if (!this.likes.users.includes(userId)) {
    this.likes.users.push(userId);
    this.likes.count += 1;
  }
  return this.save();
};

// Method to remove like
storySchema.methods.removeLike = function(userId) {
  const index = this.likes.users.indexOf(userId);
  if (index > -1) {
    this.likes.users.splice(index, 1);
    this.likes.count -= 1;
  }
  return this.save();
};

// Method to add comment
storySchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text
  });
  return this.save();
};

// Static method to get featured stories
storySchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    status: 'featured',
    publishedAt: { $exists: true }
  })
  .sort({ featuredAt: -1 })
  .limit(limit)
  .populate('volunteer.id', 'name')
  .populate('comments.user', 'name');
};

module.exports = mongoose.model('Story', storySchema);