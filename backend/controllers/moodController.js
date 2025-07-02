const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * Create a new mood entry
 * POST /api/mood
 */
const createMoodEntry = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { moodScore, notes, tags, timeOfDay } = req.body;
    const userId = req.user.id;

    // Check if user already has an entry for today with same timeOfDay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await MoodEntry.findOne({
      userId,
      timeOfDay,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: `You've already logged your ${timeOfDay} mood for today. You can update it instead.`,
        existingEntry: existingEntry._id
      });
    }

    // Create new mood entry
    const moodEntry = new MoodEntry({
      userId,
      moodScore,
      notes: notes || '',
      tags: tags || [],
      timeOfDay,
      date: today
    });

    await moodEntry.save();

    // Populate user data for response
    await moodEntry.populate('userId', 'username profile.displayName');

    res.status(201).json({
      success: true,
      message: 'Mood entry created successfully',
      data: moodEntry
    });

  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mood entry',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get mood entries for the current user
 * GET /api/mood
 */
const getMoodEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      startDate, 
      endDate, 
      limit = 30, 
      page = 1, 
      timeOfDay, 
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;

    // Build query
    const query = { userId };

    // Date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Time of day filtering
    if (timeOfDay && ['morning', 'afternoon', 'evening'].includes(timeOfDay)) {
      query.timeOfDay = timeOfDay;
    }

    // Pagination
    const pageSize = Math.min(parseInt(limit), 100); // Max 100 entries per page
    const skip = (parseInt(page) - 1) * pageSize;

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [entries, totalCount] = await Promise.all([
      MoodEntry.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      MoodEntry.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        pageSize,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood entries',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get a single mood entry by ID
 * GET /api/mood/:id
 */
const getMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const moodEntry = await MoodEntry.findOne({ _id: id, userId });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      data: moodEntry
    });

  } catch (error) {
    console.error('Get mood entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood entry',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Update a mood entry
 * PUT /api/mood/:id
 */
const updateMoodEntry = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const { moodScore, notes, tags, timeOfDay } = req.body;

    // Find and update the mood entry
    const moodEntry = await MoodEntry.findOne({ _id: id, userId });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    // Update fields
    if (moodScore !== undefined) moodEntry.moodScore = moodScore;
    if (notes !== undefined) moodEntry.notes = notes;
    if (tags !== undefined) moodEntry.tags = tags;
    if (timeOfDay !== undefined) moodEntry.timeOfDay = timeOfDay;

    await moodEntry.save();

    res.json({
      success: true,
      message: 'Mood entry updated successfully',
      data: moodEntry
    });

  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mood entry',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete a mood entry
 * DELETE /api/mood/:id
 */
const deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const moodEntry = await MoodEntry.findOneAndDelete({ _id: id, userId });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    // Update user stats (decrease total check-ins)
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalCheckIns': -1 }
    });

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mood entry',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get mood statistics for the current user
 * GET /api/mood/stats
 */
const getMoodStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = '30d' } = req.query;

    // Get user stats using the model method
    const stats = await MoodEntry.getUserStats(userId, timeframe);

    // Get recent mood trend (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentEntries = await MoodEntry.find({
      userId,
      date: { $gte: last7Days }
    })
    .sort({ date: 1 })
    .select('moodScore date timeOfDay')
    .lean();

    // Get user's current streak
    const user = await User.findById(userId).select('stats');

    res.json({
      success: true,
      data: {
        ...stats,
        currentStreak: user?.stats?.currentStreak || 0,
        longestStreak: user?.stats?.longestStreak || 0,
        recentTrend: recentEntries,
        timeframe
      }
    });

  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get mood trends for charts
 * GET /api/mood/trends
 */
const getMoodTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'week' } = req.query;

    let startDate = new Date();
    let groupBy;

    // Determine date range and grouping
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = '$date';
        break;
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        groupBy = '$date';
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = { 
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
        groupBy = '$date';
    }

    const trends = await MoodEntry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          averageMood: { $avg: '$moodScore' },
          entryCount: { $sum: 1 },
          moodScores: { $push: '$moodScore' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      success: true,
      data: trends,
      period
    });

  } catch (error) {
    console.error('Get mood trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood trends',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createMoodEntry,
  getMoodEntries,
  getMoodEntry,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
  getMoodTrends
}; 