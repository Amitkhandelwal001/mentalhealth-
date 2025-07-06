const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
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
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ authorId: 1 });
commentSchema.index({ flagCount: 1 });

// Virtual for anonymous author name
commentSchema.virtual('anonymousAuthor').get(function() {
  // Generate consistent anonymous name based on author ID
  const id = this.authorId.toString();
  const hash = id.slice(-4);
  return `Anonymous${hash}`;
});

// Virtual for safe comment data (removes sensitive info)
commentSchema.virtual('safeData').get(function() {
  return {
    _id: this._id,
    postId: this.postId,
    content: this.content,
    likes: this.likes,
    anonymousAuthor: this.anonymousAuthor,
    createdAt: this.createdAt,
    isHidden: this.isHidden
  };
});

// Method to check if user has liked comment
commentSchema.methods.isLikedByUser = function(userId) {
  return this.likedBy.includes(userId);
};

// Method to check if user has flagged comment
commentSchema.methods.isFlaggedByUser = function(userId) {
  return this.flaggedBy.includes(userId);
};

// Ensure virtuals are included in JSON
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 