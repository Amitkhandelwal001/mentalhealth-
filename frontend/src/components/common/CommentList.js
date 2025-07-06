import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../utils/api';
import CommentCard from './CommentCard';

const CommentList = ({ postId, commentCount, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchComments = useCallback(async (page = 1, replace = false) => {
    try {
      if (page === 1 && replace) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await communityAPI.getComments(postId, {
        page, limit: 10
      });

      const { comments: newComments, pagination: newPagination } = response.data.data;

      if (replace) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }

      setPagination(newPagination);

      // Update parent component's comment count if it has changed
      if (onCommentCountChange && newPagination.totalComments !== commentCount) {
        onCommentCountChange(newPagination.totalComments);
      }

    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [postId, commentCount, onCommentCountChange]);

  useEffect(() => {
    fetchComments(1, true);
  }, [fetchComments]);

  const handleCommentLike = (commentId, likeData) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id === commentId
          ? {
              ...comment,
              likes: likeData.likes,
              isLiked: likeData.liked
            }
          : comment
      )
    );
  };

  const handleCommentFlag = (commentId) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id === commentId
          ? { ...comment, isFlagged: true }
          : comment
      )
    );
  };

  const handleCommentDelete = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
    setPagination(prev => ({
      ...prev,
      totalComments: prev.totalComments - 1
    }));
    
    // Update parent component's comment count
    if (onCommentCountChange) {
      onCommentCountChange(pagination.totalComments - 1);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    setPagination(prev => ({
      ...prev,
      totalComments: prev.totalComments + 1
    }));
    
    // Update parent component's comment count
    if (onCommentCountChange) {
      onCommentCountChange(pagination.totalComments + 1);
    }
  };

  const loadMoreComments = () => {
    if (pagination.hasNext && !loadingMore) {
      fetchComments(pagination.currentPage + 1, false);
    }
  };

  const canDeleteComment = (comment) => {
    return user && user.id === comment.authorId;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          <span className="ml-2 text-gray-600">Loading comments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <span className="text-4xl">⚠️</span>
          <p className="text-lg font-medium mt-2">{error}</p>
        </div>
        <button
          onClick={() => fetchComments(1, true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({pagination.totalComments})
        </h3>
        <button
          onClick={() => fetchComments(1, true)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl">💬</span>
          <h3 className="text-lg font-medium text-gray-900 mt-4">No comments yet</h3>
          <p className="text-gray-600 mt-2">
            Be the first to share your thoughts on this post!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onLike={handleCommentLike}
              onFlag={handleCommentFlag}
              onDelete={handleCommentDelete}
              canDelete={canDeleteComment(comment)}
            />
          ))}

          {/* Load More Button */}
          {pagination.hasNext && (
            <div className="text-center pt-4">
              <button
                onClick={loadMoreComments}
                disabled={loadingMore}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    <span>Loading more...</span>
                  </div>
                ) : (
                  `Load More Comments (${pagination.totalComments - comments.length} remaining)`
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList; 