import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../../utils/api';
import { 
  getActivityIcon, 
  getActivityColor, 
  getCategoryInfo, 
  formatDuration 
} from '../../utils/activityData';

const ActivityRecommendations = () => {
  const [activities, setActivities] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getRecommendedActivities({ limit: 3 });
      setActivities(response.data.activities);
      setRecommendation(response.data.recommendation);
    } catch (err) {
      console.error('Error fetching activity recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityClick = (activity) => {
    navigate(`/activities/${activity._id}`);
  };

  const handleViewAll = () => {
    navigate('/activities?tab=recommended');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recommended Activities
        </h3>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm">
            {error || 'No recommendations available. Try logging some mood entries first!'}
          </p>
          <button
            onClick={() => navigate('/activities')}
            className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm"
          >
            Browse all activities →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recommended for You
        </h3>
        <button
          onClick={handleViewAll}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          View All →
        </button>
      </div>

      {recommendation && (
        <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700">
            {recommendation.message}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {activities.map((activity) => {
          const categoryInfo = getCategoryInfo(activity.category);
          const icon = getActivityIcon(activity);
          const color = getActivityColor(activity);

          return (
            <div
              key={activity._id}
              onClick={() => handleActivityClick(activity)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${color}20`, color: color }}
              >
                {icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {activity.name}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{categoryInfo.name}</span>
                  <span>•</span>
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              </div>
              
              <div className="text-gray-400">
                →
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate('/activities')}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
        >
          Browse All Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityRecommendations; 