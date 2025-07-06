const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  flagPost,
  getCommunityStats,
  addComment,
  getComments,
  likeComment,
  flagComment,
  deleteComment
} = require('../controllers/communityController');

/**
 * @route   POST /api/community/posts
 * @desc    Create a new community post
 * @access  Private
 */
router.post('/posts', authenticateToken, createPost);

/**
 * @route   GET /api/community/posts
 * @desc    Get community posts with pagination and filtering
 * @access  Public (with optional auth for like status)
 */
router.get('/posts', optionalAuth, getPosts);

/**
 * @route   GET /api/community/posts/:id
 * @desc    Get a single community post
 * @access  Public (with optional auth for like status)
 */
router.get('/posts/:id', optionalAuth, getPost);

/**
 * @route   POST /api/community/posts/:id/like
 * @desc    Like or unlike a post
 * @access  Private
 */
router.post('/posts/:id/like', authenticateToken, likePost);

/**
 * @route   POST /api/community/posts/:id/flag
 * @desc    Flag a post as inappropriate
 * @access  Private
 */
router.post('/posts/:id/flag', authenticateToken, flagPost);

/**
 * @route   POST /api/community/posts/:id/comments
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post('/posts/:id/comments', authenticateToken, addComment);

/**
 * @route   GET /api/community/posts/:id/comments
 * @desc    Get comments for a post
 * @access  Public (with optional auth for like/flag status)
 */
router.get('/posts/:id/comments', optionalAuth, getComments);

/**
 * @route   POST /api/community/comments/:id/like
 * @desc    Like or unlike a comment
 * @access  Private
 */
router.post('/comments/:id/like', authenticateToken, likeComment);

/**
 * @route   POST /api/community/comments/:id/flag
 * @desc    Flag a comment as inappropriate
 * @access  Private
 */
router.post('/comments/:id/flag', authenticateToken, flagComment);

/**
 * @route   DELETE /api/community/comments/:id
 * @desc    Delete a comment (author only)
 * @access  Private
 */
router.delete('/comments/:id', authenticateToken, deleteComment);

/**
 * @route   GET /api/community/stats
 * @desc    Get community statistics
 * @access  Public
 */
router.get('/stats', getCommunityStats);

module.exports = router; 