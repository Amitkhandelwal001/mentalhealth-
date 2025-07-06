import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityAPI } from '../utils/api';
import { formatTimeAgo, getCategoryInfo, formatPostStats } from '../utils/communityData';
import Navigation from '../components/common/Navigation';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AddComment from '../components/forms/AddComment';
import CommentList from '../components/common/CommentList';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const fetchPost = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getPost(id);
      // Access nested data structure (response.data.data.post)
      const responseData = response.data.data || response.data;
      setPost(responseData.post);
      setCommentCount(responseData.post.commentCount || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await communityAPI.likePost(post._id);
      // Access nested data structure (response.data.data)
      const responseData = response.data.data || response.data;
      setPost(prev => ({
        ...prev,
        isLiked: responseData.liked,
        likes: responseData.likes
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBack = () => {
    navigate('/community');
  };

  const handleCommentAdded = (newComment) => {
    setCommentCount(prev => prev + 1);
    setPost(prev => ({
      ...prev,
      commentCount: prev.commentCount + 1
    }));
  };

  const handleCommentCountChange = (newCount) => {
    setCommentCount(newCount);
    setPost(prev => ({
      ...prev,
      commentCount: newCount
    }));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <div className="space-x-2">
                <button
                  onClick={fetchPost}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!post) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-600 mb-4">Post not found</p>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const categoryInfo = getCategoryInfo(post.category);
  const stats = formatPostStats(post.likes, commentCount);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Community
            </button>
          </div>

          {/* Post Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {post.authorName === 'Anonymous' ? 'A' : post.authorName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-lg">
                      {post.authorName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className={`px-3 py-2 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                  <span className="mr-2">{categoryInfo.icon}</span>
                  {categoryInfo.name}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Content */}
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      post.isLiked 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className={`text-lg ${isLiking ? 'animate-pulse' : ''}`}>
                      {post.isLiked ? '❤️' : '🤍'}
                    </span>
                    <span>{stats.likes} {stats.likesLabel}</span>
                  </button>

                  {/* Comments */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-lg">💬</span>
                    <span className="text-sm">{stats.comments} {stats.commentsLabel}</span>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.content,
                        url: window.location.href
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-lg">🔗</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 space-y-6">
            {/* Add Comment Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <AddComment 
                postId={post._id} 
                onCommentAdded={handleCommentAdded} 
              />
            </div>

            {/* Comments List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CommentList 
                postId={post._id} 
                commentCount={commentCount}
                onCommentCountChange={handleCommentCountChange}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostDetailPage; 