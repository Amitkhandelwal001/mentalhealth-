const express = require('express');
const router = express.Router();
const { 
  getActivities, 
  getRecommendedActivities, 
  completeActivity, 
  getUserActivityHistory,
  getActivityById 
} = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getActivities);

// Protected routes (require authentication)
router.get('/recommendations', authenticateToken, getRecommendedActivities);
router.get('/history', authenticateToken, getUserActivityHistory);
router.post('/:id/complete', authenticateToken, completeActivity);

// Parameterized routes (must come after specific routes)
router.get('/:id', getActivityById);

module.exports = router; 