import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityList from '../components/common/ActivityList';
import { activityAPI } from '../utils/api';
import { ACTIVITY_CATEGORIES } from '../utils/activityData';
import Navigation from '../components/common/Navigation';
import ProtectedRoute from '../components/common/ProtectedRoute';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [recommendedActivities, setRecommendedActivities] = useState([]);
  const [completedActivityIds, setCompletedActivityIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [recommendation, setRecommendation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all activities and recommendations in parallel
      const [activitiesResponse, recommendationsResponse, historyResponse] = await Promise.all([
        activityAPI.getActivities(),
        activityAPI.getRecommendedActivities(),
        activityAPI.getActivityHistory({ limit: 100 })
      ]);

      setActivities(activitiesResponse.data.activities);
      setRecommendedActivities(recommendationsResponse.data.activities);
      setRecommendation(recommendationsResponse.data.recommendation);
      
      // Extract completed activity IDs
      const completedIds = historyResponse.data.activities.map(activity => activity.activityId._id);
      setCompletedActivityIds(completedIds);
      
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartActivity = (activity) => {
    navigate(`/activities/${activity._id}`);
  };

  const handleViewDetails = (activity) => {
    navigate(`/activities/${activity._id}`);
  };

  const getTabActivities = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendedActivities;
      case 'breathing':
      case 'journaling':
      case 'physical':
      case 'mindfulness':
        return activities.filter(activity => activity.category === activeTab);
      default:
        return activities;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'recommended':
        return 'Recommended for You';
      case 'breathing':
      case 'journaling':
      case 'physical':
      case 'mindfulness':
        return ACTIVITY_CATEGORIES[activeTab]?.name || 'Activities';
      default:
        return 'All Activities';
    }
  };

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
                  <p className="mt-1 text-gray-600">
                    Discover activities to boost your mental wellness
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/activities/history')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    📚 History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Banner */}
        {recommendation && !loading && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Personalized Recommendations</h2>
                  <p className="text-indigo-100 mt-1">
                    {recommendation.message}
                  </p>
                  <p className="text-xs text-indigo-200 mt-2">
                    Based on your recent mood: {recommendation.avgMood}/5
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium"
                >
                  View Recommendations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'all'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Activities
                </button>
                
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'recommended'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ✨ Recommended
                </button>
                
                {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === key
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Activity List */}
          <ActivityList
            activities={getTabActivities()}
            onStartActivity={handleStartActivity}
            onViewDetails={handleViewDetails}
            loading={loading}
            completedActivityIds={completedActivityIds}
            title={getTabTitle()}
            showFilters={activeTab === 'all'}
            emptyMessage={
              activeTab === 'recommended' 
                ? 'No recommendations available. Try logging a few mood entries first!'
                : 'No activities found in this category.'
            }
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ActivitiesPage; 