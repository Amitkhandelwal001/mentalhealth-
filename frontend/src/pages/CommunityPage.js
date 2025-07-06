import React, { useState, useEffect } from 'react';
import { communityAPI } from '../utils/api';
import { sortOptions, getEmptyStatePlaceholder } from '../utils/communityData';
import PostCard from '../components/common/PostCard';
import CreatePost from '../components/forms/CreatePost';
import CategoryFilter from '../components/common/CategoryFilter';
import Navigation from '../components/common/Navigation';
import ProtectedRoute from '../components/common/ProtectedRoute';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Filter and sort state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch posts function with useCallback to prevent re-renders
  const fetchPosts = React.useCallback(async (page = 1, reset = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page,
        limit: 10,
        sort: sortBy,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined
      };

      const response = await communityAPI.getPosts(params);
      
      // Access nested data structure (response.data.data.posts)
      const responseData = response.data.data || response.data;
      const newPosts = Array.isArray(responseData.posts) ? responseData.posts : [];
      const pagination = responseData.pagination || {};
      
      if (reset || page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prevPosts => {
          // Ensure prevPosts is an array
          const currentPosts = Array.isArray(prevPosts) ? prevPosts : [];
          return [...currentPosts, ...newPosts];
        });
      }

      setCurrentPage(pagination.currentPage || 1);
      setHasMore(pagination.hasNext || false);
      setError(null);

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please check your connection and try again.');
      // Set posts to empty array on error to prevent iteration issues
      if (page === 1) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sortBy, selectedCategory, searchQuery]);

  // Initial load and when filters change
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  // Handle post creation
  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => {
      // Ensure prevPosts is an array and newPost is valid
      const currentPosts = Array.isArray(prevPosts) ? prevPosts : [];
      return newPost ? [newPost, ...currentPosts] : currentPosts;
    });
    setShowCreatePost(false);
  };

  // Handle post like
  const handlePostLike = (postId, isLiked, newLikeCount) => {
    setPosts(prevPosts => {
      // Ensure prevPosts is an array
      const currentPosts = Array.isArray(prevPosts) ? prevPosts : [];
      return currentPosts.map(post => 
        post._id === postId 
          ? { ...post, isLiked, likes: newLikeCount }
          : post
      );
    });
  };

  // Handle post flag
  const handlePostFlag = (postId) => {
    // For now, just show a message. In a real app, you might remove the post or mark it
    console.log('Post flagged:', postId);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchPosts(currentPage + 1, false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, true);
  };

  const emptyPlaceholder = getEmptyStatePlaceholder(selectedCategory);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Support
            </h1>
            <p className="text-gray-600">
              Connect with others, share your experiences, and find support in our anonymous community.
            </p>
          </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>✏️</span>
            Create Post
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CreatePost 
              onPostCreated={handlePostCreated}
              onCancel={() => setShowCreatePost(false)}
            />
          </div>
        </div>
      )}

      {/* Posts Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => fetchPosts(1, true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <span className="text-6xl mb-4 block">{emptyPlaceholder.icon}</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {emptyPlaceholder.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {emptyPlaceholder.message}
          </p>
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Posts List */}
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handlePostLike}
                onFlag={handlePostFlag}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}

          {/* End Message */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                You've reached the end of the posts. 
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Create a new post
                </button>
                to start a conversation!
              </p>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CommunityPage; 