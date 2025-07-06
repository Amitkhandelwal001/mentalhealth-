import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../utils/api';
import { showCommunitySuccess, showCommunityError, showQuickSuccess } from '../../utils/toast';

const CommentCard = ({ 
  comment, 
  onLike, 
  onFlag, 
  onDelete, 
  canDelete = false 
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleLike = async () => {
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const response = await communityAPI.likeComment(comment._id);
      if (onLike) {
        onLike(comment._id, response.data.data);
      }
      
      // Show quick success toast
      showQuickSuccess(comment.isLiked ? 'Like removed' : 'Liked!');
      
    } catch (error) {
      console.error('Error liking comment:', error);
      showCommunityError('Failed to like comment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlag = async () => {
    if (!user || isProcessing || comment.isFlagged) return;
    
    const reason = prompt('Please provide a reason for flagging this comment:');
    if (!reason) return;

    setIsProcessing(true);
    try {
      await communityAPI.flagComment(comment._id, { reason });
      if (onFlag) {
        onFlag(comment._id);
      }
      
      // Show success toast
      showCommunitySuccess('flag');
      
    } catch (error) {
      console.error('Error flagging comment:', error);
      showCommunityError('Failed to flag comment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || isProcessing) return;
    
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsProcessing(true);
    try {
      await communityAPI.deleteComment(comment._id);
      if (onDelete) {
        onDelete(comment._id);
      }
      
      // Show success toast
      showCommunitySuccess('delete');
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      showCommunityError('Failed to delete comment');
    } finally {
      setIsProcessing(false);
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const shouldTruncate = comment.content.length > 200;
  const displayContent = shouldTruncate && !showFullContent 
    ? truncateContent(comment.content) 
    : comment.content;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      {/* Comment Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {comment.anonymousAuthor.slice(-2)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">
              {comment.anonymousAuthor}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </div>
          </div>
        </div>
        
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>

      {/* Comment Content */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
          >
            {showFullContent ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Comment Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!user || isProcessing}
            className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
              comment.isLiked
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-500 hover:text-red-600'
            } ${!user || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-lg">
              {comment.isLiked ? '❤️' : '🤍'}
            </span>
            <span>{comment.likes || 0}</span>
          </button>

          {/* Flag Button */}
          {user && !comment.isFlagged && (
            <button
              onClick={handleFlag}
              disabled={isProcessing}
              className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <span className="text-lg">🚩</span>
              <span>Flag</span>
            </button>
          )}

          {comment.isFlagged && (
            <span className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
              <span className="text-lg">🚩</span>
              <span>Flagged</span>
            </span>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard; 