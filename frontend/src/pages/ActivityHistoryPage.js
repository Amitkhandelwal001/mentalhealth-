import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { activityAPI } from '../utils/api';
import { formatDuration, getCategoryInfo, getDifficultyInfo } from '../utils/activityData';

const ActivityHistoryPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchActivityHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10
      };

      if (filterCategory !== 'all') {
        params.category = filterCategory;
      }

      const response = await activityAPI.getActivityHistory(params);
      setActivities(response.data.activities);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching activity history:', err);
      setError('Failed to load activity history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterCategory]);

  useEffect(() => {
    fetchActivityHistory();
  }, [fetchActivityHistory]);

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getActivityRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={fetchActivityHistory}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/activities')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Back to Activities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <button
                    onClick={() => navigate('/activities')}
                    className="mr-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    ← Back to Activities
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
                <p className="mt-1 text-gray-600">
                  Review your completed wellness activities and track your progress
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to="/activities"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Browse Activities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {!loading && stats.total && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Completed</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total.totalActivities || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total.averageRating ? stats.total.averageRating.toFixed(1) : '0'}/5
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Points Earned</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total.totalPoints || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Time</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(stats.total.totalDuration || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filterCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {['breathing', 'journaling', 'physical', 'mindfulness'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filterCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                              >
                  {getCategoryInfo(category).icon} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            ))}
          </div>
        </div>

        {/* Activity History List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Completed Activities</h2>
            <p className="text-gray-600 mt-1">
              {pagination.total ? `Showing ${Math.min(pagination.total, activities.length)} of ${pagination.total} activities` : 'No activities completed yet'}
            </p>
          </div>

          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
              <p className="text-gray-600 mb-6">
                {filterCategory === 'all' 
                  ? "You haven't completed any activities yet. Start your wellness journey today!"
                  : `No ${filterCategory} activities completed yet. Try a different category or complete some activities first.`
                }
              </p>
              <Link
                to="/activities"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Browse Activities
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Activity Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center`} style={{ backgroundColor: getDifficultyInfo(activity.activityId?.difficultyLevel || 'beginner').color + '20' }}>
                        <span className="text-2xl">
                          {activity.activityId?.icon || getCategoryInfo(activity.activityId?.category || 'breathing').icon}
                        </span>
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.activityId?.name || 'Unknown Activity'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="capitalize">
                            {getCategoryInfo(activity.activityId?.category || 'breathing').icon} {activity.activityId?.category || 'breathing'}
                          </span>
                          <span>•</span>
                          <span>{formatDuration(activity.duration)}</span>
                          <span>•</span>
                          <span className="capitalize">{activity.activityId?.difficultyLevel}</span>
                          <span>•</span>
                          <span>{activity.pointsEarned} points</span>
                        </div>
                        
                        {/* Rating */}
                        {activity.rating && (
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                            <span className="text-sm">{getActivityRatingStars(activity.rating)}</span>
                          </div>
                        )}

                        {/* Notes */}
                        {activity.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 italic">"{activity.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Completion Date */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {formatDate(activity.completedAt)}
                      </div>
                      <button
                        onClick={() => navigate(`/activities/${activity.activityId._id}`)}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
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

export default ActivityHistoryPage; 