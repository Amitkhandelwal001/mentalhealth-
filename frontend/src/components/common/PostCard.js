import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../utils/api';
import { formatTimeAgo, truncateText, getCategoryInfo, formatPostStats } from '../../utils/communityData';
import { showCommunitySuccess, showCommunityError, showQuickSuccess } from '../../utils/toast';

const PostCard = ({ post, onLike, onFlag, showFullContent = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const categoryInfo = getCategoryInfo(post.category);
  const stats = formatPostStats(post.likes, post.commentCount);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await communityAPI.likePost(post._id);
      if (onLike) {
        // Access nested data structure (response.data.data)
        const responseData = response.data.data || response.data;
        onLike(post._id, responseData.liked, responseData.likes);
      }
      
      // Show quick success toast
      showQuickSuccess(post.isLiked ? 'Like removed' : 'Liked!');
      
    } catch (error) {
      console.error('Error liking post:', error);
      showCommunityError('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleFlag = async (reason) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFlagging) return;
    setIsFlagging(true);

    try {
      await communityAPI.flagPost(post._id, { reason });
      setShowFlagModal(false);
      if (onFlag) {
        onFlag(post._id);
      }
      
      // Show success toast
      showCommunitySuccess('flag');
      
    } catch (error) {
      console.error('Error flagging post:', error);
      showCommunityError('Failed to flag post');
    } finally {
      setIsFlagging(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/community/posts/${post._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-4 cursor-pointer" onClick={handleCardClick}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {post.authorName === 'Anonymous' ? 'A' : post.authorName[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {post.authorName}
              </p>
              <p className="text-sm text-gray-500">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
            <span className="mr-1">{categoryInfo.icon}</span>
            {categoryInfo.name}
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {showFullContent ? post.content : truncateText(post.content, 200)}
          </p>
          {!showFullContent && post.content.length > 200 && (
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              Read more
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              post.isLiked 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`text-base ${isLiking ? 'animate-pulse' : ''}`}>
              {post.isLiked ? '❤️' : '🤍'}
            </span>
            <span>{stats.likes}</span>
          </button>

          {/* Comments Button */}
          <button
            onClick={handleCardClick}
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span className="text-base">💬</span>
            <span>{stats.comments}</span>
          </button>
        </div>

        {/* Flag Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFlagModal(true);
            }}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Flag post"
          >
            <span className="text-gray-500 text-sm">⚠️</span>
          </button>

          {/* Flag Modal */}
          {showFlagModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Flag Post</h3>
                <p className="text-gray-600 mb-4">
                  Why are you flagging this post?
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFlag('inappropriate')}
                    disabled={isFlagging}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Inappropriate content
                  </button>
                  <button
                    onClick={() => handleFlag('spam')}
                    disabled={isFlagging}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Spam
                  </button>
                  <button
                    onClick={() => handleFlag('harassment')}
                    disabled={isFlagging}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Harassment
                  </button>
                  <button
                    onClick={() => handleFlag('other')}
                    disabled={isFlagging}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Other
                  </button>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowFlagModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard; 