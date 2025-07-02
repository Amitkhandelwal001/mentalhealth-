const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  getCurrentUser,
  logout,
  refreshToken,
  updateProfile
} = require('../controllers/authController');

// Import middleware
const { authenticateToken, rateLimit } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  rateLimit(5, 15 * 60 * 1000), // 5 requests per 15 minutes
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', 
  rateLimit(10, 15 * 60 * 1000), // 10 requests per 15 minutes
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', 
  authenticateToken,
  getCurrentUser
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticateToken,
  logout
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh user token
 * @access  Private
 */
router.post('/refresh',
  authenticateToken,
  refreshToken
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  authenticateToken,
  updateProfile
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity (useful for frontend)
 * @access  Private
 */
router.get('/verify',
  authenticateToken,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email
        }
      }
    });
  }
);

module.exports = router; 