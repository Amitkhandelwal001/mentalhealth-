const Activity = require('../models/Activity');
const UserActivity = require('../models/UserActivity');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');

// Get all activities with optional filtering
const getActivities = async (req, res) => {
  try {
    const { category, difficulty, tags, limit = 20, page = 1 } = req.query;
    
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficultyLevel = difficulty;
    if (tags) filter.tags = { $in: tags.split(',') };
    
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Activity.countDocuments(filter);
    
    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
};

// Get recommended activities based on user's recent mood
const getRecommendedActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 6 } = req.query;
    
    // Get user's recent mood entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMoods = await MoodEntry.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 }).limit(5);
    
    // Calculate average mood
    let avgMood = 3; // Default neutral mood
    if (recentMoods.length > 0) {
      const totalMood = recentMoods.reduce((sum, mood) => sum + mood.moodScore, 0);
      avgMood = totalMood / recentMoods.length;
    }
    
    // Get user's recently completed activities to avoid repetition
    const recentActivities = await UserActivity.find({
      userId,
      completedAt: { $gte: sevenDaysAgo }
    }).distinct('activityId');
    
    // Recommendation logic based on mood
    let recommendedCategories = [];
    if (avgMood < 3) {
      // Low mood: breathing + mindfulness
      recommendedCategories = ['breathing', 'mindfulness'];
    } else if (avgMood === 3) {
      // Neutral mood: journaling + light physical
      recommendedCategories = ['journaling', 'physical'];
    } else {
      // Good mood: physical + journaling
      recommendedCategories = ['physical', 'journaling'];
    }
    
    // Get activities for recommended categories
    const activities = await Activity.find({
      category: { $in: recommendedCategories },
      isActive: true,
      _id: { $nin: recentActivities } // Exclude recently completed
    }).limit(parseInt(limit));
    
    // If not enough activities, add from other categories
    if (activities.length < limit) {
      const remainingLimit = limit - activities.length;
      const otherActivities = await Activity.find({
        category: { $nin: recommendedCategories },
        isActive: true,
        _id: { $nin: [...recentActivities, ...activities.map(a => a._id)] }
      }).limit(remainingLimit);
      
      activities.push(...otherActivities);
    }
    
    res.json({
      activities,
      recommendation: {
        avgMood: Math.round(avgMood * 10) / 10,
        categories: recommendedCategories,
        message: getMoodMessage(avgMood)
      }
    });
  } catch (error) {
    console.error('Error getting recommended activities:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// Mark activity as complete
const completeActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, notes, duration } = req.body;
    const userId = req.user._id;
    
    // Check if activity exists
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    // Calculate points earned
    const basePoints = 15; // Base points for completing an activity
    const difficultyMultiplier = {
      beginner: 1,
      intermediate: 1.5,
      advanced: 2
    };
    const pointsEarned = Math.round(basePoints * difficultyMultiplier[activity.difficultyLevel]);
    
    // Create user activity record
    const userActivity = new UserActivity({
      userId,
      activityId: id,
      rating,
      notes,
      duration: duration || activity.duration,
      pointsEarned
    });
    
    await userActivity.save();
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        'stats.points': pointsEarned,
        'stats.totalActivities': 1
      }
    });
    
    res.json({
      userActivity,
      pointsEarned,
      message: 'Activity completed successfully!'
    });
  } catch (error) {
    console.error('Error completing activity:', error);
    res.status(500).json({ error: 'Failed to complete activity' });
  }
};

// Get user's activity history
const getUserActivityHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, page = 1, category } = req.query;
    
    const filter = { userId };
    if (category) {
      // Need to match against populated activityId category
      const activities = await Activity.find({ category, isActive: true }).distinct('_id');
      filter.activityId = { $in: activities };
    }
    
    const skip = (page - 1) * limit;
    
    const userActivities = await UserActivity.find(filter)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await UserActivity.countDocuments(filter);
    
    // Get stats
    const stats = await getUserActivityStats(userId);
    
    res.json({
      activities: userActivities,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user activity history:', error);
    res.status(500).json({ error: 'Failed to get activity history' });
  }
};

// Get activity by ID
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    // Check if user has completed this activity recently
    let userCompletion = null;
    if (req.user) {
      userCompletion = await UserActivity.findOne({
        userId: req.user._id,
        activityId: id
      }).sort({ completedAt: -1 });
    }
    
    res.json({
      activity,
      userCompletion
    });
  } catch (error) {
    console.error('Error getting activity:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
};

// Helper function to get mood-based message
const getMoodMessage = (avgMood) => {
  if (avgMood < 2.5) {
    return "We've selected calming activities to help you feel better. Take your time and be gentle with yourself.";
  } else if (avgMood < 3.5) {
    return "Here are some balanced activities to help you maintain your mental wellness.";
  } else {
    return "You're doing great! These activities will help you maintain your positive momentum.";
  }
};

// Helper function to get user activity stats
const getUserActivityStats = async (userId) => {
  try {
    const stats = await UserActivity.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          totalPoints: { $sum: '$pointsEarned' },
          averageRating: { $avg: '$rating' },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);
    
    // Get category breakdown
    const categoryStats = await UserActivity.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: 'activities',
          localField: 'activityId',
          foreignField: '_id',
          as: 'activity'
        }
      },
      { $unwind: '$activity' },
      {
        $group: {
          _id: '$activity.category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    return {
      total: stats[0] || { totalActivities: 0, totalPoints: 0, averageRating: 0, totalDuration: 0 },
      categories: categoryStats.reduce((acc, cat) => {
        acc[cat._id] = cat.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting user activity stats:', error);
    return { total: { totalActivities: 0, totalPoints: 0, averageRating: 0, totalDuration: 0 }, categories: {} };
  }
};

module.exports = {
  getActivities,
  getRecommendedActivities,
  completeActivity,
  getUserActivityHistory,
  getActivityById
}; 