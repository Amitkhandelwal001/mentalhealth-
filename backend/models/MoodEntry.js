const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for faster queries
  },
  
  moodScore: {
    type: Number,
    required: [true, 'Mood score is required'],
    min: [1, 'Mood score must be between 1 and 5'],
    max: [5, 'Mood score must be between 1 and 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Mood score must be a whole number'
    }
  },
  
  moodEmoji: {
    type: String,
    enum: {
      values: ['😢', '😕', '😐', '🙂', '😊'],
      message: 'Mood emoji must be one of: 😢, 😕, 😐, 🙂, 😊'
    }
  },
  
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true,
    default: ''
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Each tag cannot exceed 20 characters']
  }],
  
  timeOfDay: {
    type: String,
    required: [true, 'Time of day is required'],
    enum: {
      values: ['morning', 'afternoon', 'evening'],
      message: 'Time of day must be morning, afternoon, or evening'
    }
  },
  
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true // Index for date-based queries
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Compound index for efficient user + date queries
moodEntrySchema.index({ userId: 1, date: -1 });
moodEntrySchema.index({ userId: 1, createdAt: -1 });

// Static method to get mood emoji by score
moodEntrySchema.statics.getMoodEmoji = function(score) {
  const emojiMap = {
    1: '😢', // Very sad
    2: '😕', // Sad  
    3: '😐', // Neutral
    4: '🙂', // Happy
    5: '😊'  // Very happy
  };
  return emojiMap[score] || '😐';
};

// Static method to get mood label by score
moodEntrySchema.statics.getMoodLabel = function(score) {
  const labelMap = {
    1: 'Very Sad',
    2: 'Sad',
    3: 'Neutral', 
    4: 'Happy',
    5: 'Very Happy'
  };
  return labelMap[score] || 'Unknown';
};

// Instance method to get formatted date
moodEntrySchema.methods.getFormattedDate = function() {
  return this.date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Instance method to get time ago string
moodEntrySchema.methods.getTimeAgo = function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return this.createdAt.toLocaleDateString();
};

// Pre-save middleware to set emoji based on score
moodEntrySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('moodScore')) {
    this.moodEmoji = this.constructor.getMoodEmoji(this.moodScore);
  }
  
  // Set date to start of day if not already set
  if (this.isNew && !this.date) {
    const now = new Date();
    this.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  
  next();
});

// Post-save middleware to update user stats
moodEntrySchema.post('save', async function(doc) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(doc.userId);
    
    if (user) {
      // Increment total check-ins
      user.stats.totalCheckIns += 1;
      
      // Update current streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if user had an entry yesterday
      const yesterdayEntry = await this.constructor.findOne({
        userId: doc.userId,
        date: { $gte: yesterday, $lt: today }
      });
      
      if (yesterdayEntry) {
        user.stats.currentStreak += 1;
      } else {
        // Reset streak if no entry yesterday (unless this is the first entry)
        const totalEntries = await this.constructor.countDocuments({ userId: doc.userId });
        user.stats.currentStreak = totalEntries === 1 ? 1 : 1;
      }
      
      // Update longest streak
      if (user.stats.currentStreak > user.stats.longestStreak) {
        user.stats.longestStreak = user.stats.currentStreak;
      }
      
      // Award points for mood check-in
      user.stats.points += 10;
      
      await user.save();
    }
  } catch (error) {
    console.error('Error updating user stats after mood entry:', error);
  }
});

// Static method to get user's mood statistics
moodEntrySchema.statics.getUserStats = async function(userId, timeframe = '30d') {
  const user = new mongoose.Types.ObjectId(userId);
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  
  switch (timeframe) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }
  
  const stats = await this.aggregate([
    {
      $match: {
        userId: user,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        averageMood: { $avg: '$moodScore' },
        highestMood: { $max: '$moodScore' },
        lowestMood: { $min: '$moodScore' },
        moodDistribution: {
          $push: '$moodScore'
        }
      }
    }
  ]);
  
  if (stats.length === 0) {
    return {
      totalEntries: 0,
      averageMood: 0,
      highestMood: 0,
      lowestMood: 0,
      moodDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const stat = stats[0];
  
  // Calculate mood distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stat.moodDistribution.forEach(mood => {
    distribution[mood] = (distribution[mood] || 0) + 1;
  });
  
  return {
    totalEntries: stat.totalEntries,
    averageMood: Math.round(stat.averageMood * 100) / 100,
    highestMood: stat.highestMood,
    lowestMood: stat.lowestMood,
    moodDistribution: distribution
  };
};

// Virtual for populated user data
moodEntrySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);

 