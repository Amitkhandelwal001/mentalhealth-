const CommunityPost = require('../models/CommunityPost');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { moderateContent, getCrisisResources } = require('../utils/contentModeration');

/**
 * Create a new community post
 * @route POST /api/community/posts
 * @access Private
 */
const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    // Moderate content
    const titleModeration = moderateContent(title);
    const contentModeration = moderateContent(content);

    // Check if content should be blocked
    if (!titleModeration.isAllowed || !contentModeration.isAllowed) {
      return res.status(400).json({
        success: false,
        error: 'Content contains inappropriate language and cannot be posted',
        reasons: {
          title: titleModeration.reasons,
          content: contentModeration.reasons
        }
      });
    }

    // Create post with cleaned content
    const post = new CommunityPost({
      authorId: userId,
      title: titleModeration.cleanedText,
      content: contentModeration.cleanedText,
      category: category || 'general',
      tags: tags || [],
      isAnonymous: true, // Always anonymous for privacy
      isModerated: titleModeration.needsReview || contentModeration.needsReview
    });

    const savedPost = await post.save();

    // Update user stats (add points for community engagement)
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.points': 3 } // Award 3 points for community post
    });

    // Prepare response
    const response = {
      success: true,
      data: {
        post: savedPost.getSafeData()
      }
    };

    // Add crisis resources if needed
    if (titleModeration.isCrisis || contentModeration.isCrisis) {
      response.crisisResources = getCrisisResources();
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating post'
    });
  }
};

/**
 * Get community posts with pagination and filtering
 * @route GET /api/community/posts
 * @access Public
 */
const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sort = 'newest',
      search
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    let filter = { isHidden: false };
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { likes: -1, createdAt: -1 };
        break;
      case 'discussed':
        sortOption = { commentCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Get posts with pagination
    const posts = await CommunityPost.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .select('-authorId -likedBy -flaggedBy -moderationReason');

    // Get total count for pagination
    const totalPosts = await CommunityPost.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likes: post.likes,
      commentCount: post.commentCount,
      authorName: 'Anonymous',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLiked: false // Will be updated if user is authenticated
    }));

    // If user is authenticated, check which posts they've liked
    if (req.user) {
      const likedPosts = await CommunityPost.find({
        _id: { $in: posts.map(p => p._id) },
        likedBy: req.user.id
      }).select('_id');

      const likedPostIds = likedPosts.map(p => p._id.toString());
      
      formattedPosts.forEach(post => {
        post.isLiked = likedPostIds.includes(post._id.toString());
      });
    }

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalPosts,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching posts'
    });
  }
};

/**
 * Get a single community post
 * @route GET /api/community/posts/:id
 * @access Public
 */
const getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .select('-authorId -likedBy -flaggedBy -moderationReason');

    if (!post || post.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const formattedPost = {
      _id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likes: post.likes,
      commentCount: post.commentCount,
      authorName: 'Anonymous',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLiked: false
    };

    // Check if user has liked this post
    if (req.user) {
      const likedPost = await CommunityPost.findOne({
        _id: req.params.id,
        likedBy: req.user.id
      });
      formattedPost.isLiked = !!likedPost;
    }

    res.json({
      success: true,
      data: { post: formattedPost }
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching post'
    });
  }
};

/**
 * Like or unlike a post
 * @route POST /api/community/posts/:id/like
 * @access Private
 */
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);

    if (!post || post.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if user has already liked this post
    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike the post
      await CommunityPost.findByIdAndUpdate(postId, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 }
      });

      res.json({
        success: true,
        data: {
          liked: false,
          likes: post.likes - 1
        }
      });
    } else {
      // Like the post
      await CommunityPost.findByIdAndUpdate(postId, {
        $push: { likedBy: userId },
        $inc: { likes: 1 }
      });

      // Award points to user for engagement
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.points': 1 }
      });

      res.json({
        success: true,
        data: {
          liked: true,
          likes: post.likes + 1
        }
      });
    }

  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while liking post'
    });
  }
};

/**
 * Flag a post as inappropriate
 * @route POST /api/community/posts/:id/flag
 * @access Private
 */
const flagPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    const post = await CommunityPost.findById(postId);

    if (!post || post.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if user has already flagged this post
    const hasFlagged = post.flaggedBy.includes(userId);

    if (hasFlagged) {
      return res.status(400).json({
        success: false,
        error: 'You have already flagged this post'
      });
    }

    // Flag the post
    await CommunityPost.findByIdAndUpdate(postId, {
      $push: { flaggedBy: userId },
      $inc: { flagCount: 1 }
    });

    const updatedPost = await CommunityPost.findById(postId);

    // Auto-hide post if it receives too many flags
    if (updatedPost.flagCount >= 5) {
      await CommunityPost.findByIdAndUpdate(postId, {
        isHidden: true,
        moderationReason: `Auto-hidden due to ${updatedPost.flagCount} flags`
      });
    }

    res.json({
      success: true,
      data: {
        flagged: true,
        flagCount: updatedPost.flagCount,
        message: 'Post has been flagged for review'
      }
    });

  } catch (error) {
    console.error('Error flagging post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while flagging post'
    });
  }
};

/**
 * Get community statistics
 * @route GET /api/community/stats
 * @access Public
 */
const getCommunityStats = async (req, res) => {
  try {
    const totalPosts = await CommunityPost.countDocuments({ isHidden: false });
    const totalLikes = await CommunityPost.aggregate([
      { $match: { isHidden: false } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    const categoryStats = await CommunityPost.aggregate([
      { $match: { isHidden: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPosts,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        categoryStats: categoryStats.map(stat => ({
          category: stat._id,
          count: stat.count
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching community stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching community stats'
    });
  }
};

/**
 * Add a comment to a post
 * @route POST /api/community/posts/:id/comments
 * @access Private
 */
const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    // Check if post exists and is not hidden
    const post = await CommunityPost.findById(postId);
    if (!post || post.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Moderate content
    const contentModeration = moderateContent(content);

    // Check if content should be blocked
    if (!contentModeration.isAllowed) {
      return res.status(400).json({
        success: false,
        error: 'Comment contains inappropriate language and cannot be posted',
        reasons: contentModeration.reasons
      });
    }

    // Create comment
    const comment = new Comment({
      postId,
      authorId: userId,
      content: contentModeration.cleanedText,
      isModerated: contentModeration.needsReview
    });

    const savedComment = await comment.save();

    // Update post comment count
    await CommunityPost.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 }
    });

    // Award points to user for engagement
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.points': 2 } // Award 2 points for commenting
    });

    // Prepare response
    const response = {
      success: true,
      data: {
        comment: savedComment.safeData
      }
    };

    // Add crisis resources if needed
    if (contentModeration.isCrisis) {
      response.crisisResources = getCrisisResources();
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adding comment'
    });
  }
};

/**
 * Get comments for a post
 * @route GET /api/community/posts/:id/comments
 * @access Public
 */
const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if post exists
    const post = await CommunityPost.findById(postId);
    if (!post || post.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Get comments with pagination
    const comments = await Comment.find({ 
      postId,
      isHidden: false 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalComments = await Comment.countDocuments({ 
      postId,
      isHidden: false 
    });
    const totalPages = Math.ceil(totalComments / limitNum);

    // Format comments for response
    const formattedComments = comments.map(comment => ({
      _id: comment._id,
      content: comment.content,
      likes: comment.likes,
      anonymousAuthor: comment.anonymousAuthor,
      createdAt: comment.createdAt,
      isLiked: false, // Will be updated if user is authenticated
      isFlagged: false
    }));

    // If user is authenticated, check which comments they've liked/flagged
    if (req.user) {
      const commentIds = comments.map(c => c._id);
      
      const likedComments = await Comment.find({
        _id: { $in: commentIds },
        likedBy: req.user.id
      }).select('_id');

      const flaggedComments = await Comment.find({
        _id: { $in: commentIds },
        flaggedBy: req.user.id
      }).select('_id');

      const likedCommentIds = likedComments.map(c => c._id.toString());
      const flaggedCommentIds = flaggedComments.map(c => c._id.toString());
      
      formattedComments.forEach(comment => {
        comment.isLiked = likedCommentIds.includes(comment._id.toString());
        comment.isFlagged = flaggedCommentIds.includes(comment._id.toString());
      });
    }

    res.json({
      success: true,
      data: {
        comments: formattedComments,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalComments,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching comments'
    });
  }
};

/**
 * Like or unlike a comment
 * @route POST /api/community/comments/:id/like
 * @access Private
 */
const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment || comment.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if user has already liked this comment
    const hasLiked = comment.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike the comment
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 }
      });

      res.json({
        success: true,
        data: {
          liked: false,
          likes: comment.likes - 1
        }
      });
    } else {
      // Like the comment
      await Comment.findByIdAndUpdate(commentId, {
        $push: { likedBy: userId },
        $inc: { likes: 1 }
      });

      // Award points to user for engagement
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.points': 1 }
      });

      res.json({
        success: true,
        data: {
          liked: true,
          likes: comment.likes + 1
        }
      });
    }

  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while liking comment'
    });
  }
};

/**
 * Flag a comment as inappropriate
 * @route POST /api/community/comments/:id/flag
 * @access Private
 */
const flagComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment || comment.isHidden) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if user has already flagged this comment
    const hasFlagged = comment.flaggedBy.includes(userId);

    if (hasFlagged) {
      return res.status(400).json({
        success: false,
        error: 'You have already flagged this comment'
      });
    }

    // Flag the comment
    await Comment.findByIdAndUpdate(commentId, {
      $push: { flaggedBy: userId },
      $inc: { flagCount: 1 }
    });

    const updatedComment = await Comment.findById(commentId);

    // Auto-hide comment if it receives too many flags
    if (updatedComment.flagCount >= 3) {
      await Comment.findByIdAndUpdate(commentId, {
        isHidden: true,
        moderationReason: `Auto-hidden due to ${updatedComment.flagCount} flags`
      });

      // Update post comment count
      await CommunityPost.findByIdAndUpdate(comment.postId, {
        $inc: { commentCount: -1 }
      });
    }

    res.json({
      success: true,
      data: {
        flagged: true,
        flagCount: updatedComment.flagCount,
        message: 'Comment has been flagged for review'
      }
    });

  } catch (error) {
    console.error('Error flagging comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while flagging comment'
    });
  }
};

/**
 * Delete a comment (author only)
 * @route DELETE /api/community/comments/:id
 * @access Private
 */
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if user is the author of the comment
    if (comment.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own comments'
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Update post comment count if comment wasn't already hidden
    if (!comment.isHidden) {
      await CommunityPost.findByIdAndUpdate(comment.postId, {
        $inc: { commentCount: -1 }
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Comment deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting comment'
    });
  }
};

module.exports = {
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
}; 