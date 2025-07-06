const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

// Import controller functions
const {
  createMoodEntry,
  getMoodEntries,
  getMoodEntry,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
  getMoodTrends,
  getDashboardData
} = require('../controllers/moodController');

// Import auth middleware
const { authenticateToken } = require('../middleware/auth');

// Validation middleware
const validateMoodEntry = [
  body('moodScore')
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be an integer between 1 and 5'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 20) {
          throw new Error('Each tag must be a string with max 20 characters');
        }
      }
      return true;
    }),
  
  body('timeOfDay')
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Time of day must be morning, afternoon, or evening')
];

const validateMoodUpdate = [
  body('moodScore')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be an integer between 1 and 5'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 20) {
          throw new Error('Each tag must be a string with max 20 characters');
        }
      }
      return true;
    }),
  
  body('timeOfDay')
    .optional()
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Time of day must be morning, afternoon, or evening')
];

const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid mood entry ID')
];

const validateMoodQuery = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('timeOfDay')
    .optional()
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Time of day must be morning, afternoon, or evening'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'date', 'moodScore'])
    .withMessage('Sort by must be createdAt, date, or moodScore'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

const validateStatsQuery = [
  query('timeframe')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Timeframe must be 7d, 30d, 90d, or 1y')
];

const validateTrendsQuery = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('Period must be week, month, or year')
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   POST /api/mood
 * @desc    Create a new mood entry
 * @access  Private
 */
router.post('/', validateMoodEntry, createMoodEntry);

/**
 * @route   GET /api/mood
 * @desc    Get mood entries for the current user with filtering and pagination
 * @access  Private
 */
router.get('/', validateMoodQuery, getMoodEntries);

/**
 * @route   GET /api/mood/dashboard
 * @desc    Get dashboard data for the current user
 * @access  Private
 */
router.get('/dashboard', validateStatsQuery, getDashboardData);

/**
 * @route   GET /api/mood/stats
 * @desc    Get mood statistics for the current user
 * @access  Private
 */
router.get('/stats', validateStatsQuery, getMoodStats);

/**
 * @route   GET /api/mood/trends
 * @desc    Get mood trends for charts
 * @access  Private
 */
router.get('/trends', validateTrendsQuery, getMoodTrends);

/**
 * @route   GET /api/mood/:id
 * @desc    Get a single mood entry by ID
 * @access  Private
 */
router.get('/:id', validateObjectId, getMoodEntry);

/**
 * @route   PUT /api/mood/:id
 * @desc    Update a mood entry
 * @access  Private
 */
router.put('/:id', [...validateObjectId, ...validateMoodUpdate], updateMoodEntry);

/**
 * @route   DELETE /api/mood/:id
 * @desc    Delete a mood entry
 * @access  Private
 */
router.delete('/:id', validateObjectId, deleteMoodEntry);

module.exports = router; 