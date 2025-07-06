import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../utils/api';
import { containsCrisisKeywords, crisisResources } from '../../utils/communityData';

const AddComment = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    
    // Check for crisis keywords
    if (containsCrisisKeywords(value)) {
      setShowCrisisResources(true);
    } else {
      setShowCrisisResources(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to add comments');
      return;
    }

    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (comment.length > 1000) {
      setError('Comment must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await communityAPI.addComment(postId, {
        content: comment.trim()
      });

      const newComment = response.data.data;
      
      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }

      // Reset form
      setComment('');
      setShowCrisisResources(false);

    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CrisisResourcesAlert = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">🆘</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            We're here to help
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              If you're experiencing thoughts of self-harm or suicide, please reach out for help immediately:
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <strong>National Suicide Prevention Lifeline:</strong>
                <br />
                <a href="tel:988" className="text-red-800 hover:text-red-900 font-medium">
                  Call or Text 988
                </a>
              </div>
              <div>
                <strong>Crisis Text Line:</strong>
                <br />
                <span className="font-medium">Text HOME to 741741</span>
              </div>
              <div>
                <strong>International Crisis Lines:</strong>
                <br />
                <a 
                  href="https://findahelpline.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-800 hover:text-red-900 font-medium"
                >
                  findahelpline.com
                </a>
              </div>
            </div>
            <p className="mt-3 text-xs">
              Remember: You matter, and help is available 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <span className="text-4xl">💬</span>
        <h3 className="text-lg font-medium text-gray-900 mt-2">Join the conversation</h3>
        <p className="text-gray-600 mt-1">Sign in to share your thoughts and support others</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Crisis Resources Alert */}
      {showCrisisResources && <CrisisResourcesAlert />}

      {/* Comment Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Header */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.username?.slice(0, 2).toUpperCase() || 'AN'}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Add a comment</h4>
              <p className="text-xs text-gray-500">Share your thoughts anonymously</p>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Share your thoughts, experiences, or offer support..."
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${comment.length > 900 ? 'text-red-600' : 'text-gray-500'}`}>
                {comment.length}/1000 characters
              </span>
              {showCrisisResources && (
                <span className="text-xs text-red-600 font-medium">
                  Crisis keywords detected - resources shown above
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-red-500 text-lg mr-2">⚠️</span>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              💡 Your comment will be posted anonymously
            </div>
            <div className="flex items-center space-x-3">
              {comment.trim() && (
                <button
                  type="button"
                  onClick={() => setComment('')}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  disabled={isSubmitting}
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={!comment.trim() || isSubmitting || comment.length > 1000}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Post Comment'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComment; 