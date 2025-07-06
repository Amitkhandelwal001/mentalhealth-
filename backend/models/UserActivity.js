const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  duration: {
    type: Number, // Actual time spent in minutes
    min: 1,
    max: 240 // Max 4 hours
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
userActivitySchema.index({ userId: 1, completedAt: -1 });
userActivitySchema.index({ activityId: 1 });
userActivitySchema.index({ userId: 1, activityId: 1 });

// Populate activity details when querying
userActivitySchema.pre(['find', 'findOne'], function() {
  this.populate('activityId', 'name category description duration difficultyLevel icon color');
});

module.exports = mongoose.model('UserActivity', userActivitySchema); 