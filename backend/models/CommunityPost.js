const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['support', 'celebration', 'question', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  isAnonymous: {
    type: Boolean,
    default: true // Always true for privacy as per requirements
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  flagCount: {
    type: Number,
    default: 0,
    min: 0
  },
  flaggedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isHidden: {
    type: Boolean,
    default: false
  },
  moderationReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for better query performance
communityPostSchema.index({ category: 1, createdAt: -1 });
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ likes: -1 });

// Virtual for getting anonymous author name
communityPostSchema.virtual('authorName').get(function() {
  return this.isAnonymous ? 'Anonymous' : 'User';
});

// Method to check if post is flagged too many times
communityPostSchema.methods.isOverFlagged = function() {
  return this.flagCount >= 5;
};

// Method to get safe post data (without sensitive info)
communityPostSchema.methods.getSafeData = function() {
  return {
    _id: this._id,
    title: this.title,
    content: this.content,
    category: this.category,
    tags: this.tags,
    likes: this.likes,
    commentCount: this.commentCount,
    authorName: this.authorName,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('CommunityPost', communityPostSchema); 