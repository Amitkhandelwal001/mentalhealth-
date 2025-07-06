const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['breathing', 'journaling', 'physical', 'mindfulness']
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Instructions must contain at least one step'
    }
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 120 // Max 2 hours
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  tags: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: '🧘'
  },
  color: {
    type: String,
    default: '#6366f1'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
activitySchema.index({ category: 1, isActive: 1 });
activitySchema.index({ difficultyLevel: 1, isActive: 1 });
activitySchema.index({ tags: 1 });

module.exports = mongoose.model('Activity', activitySchema); 