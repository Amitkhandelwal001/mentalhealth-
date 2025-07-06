import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActivityDetail from '../components/common/ActivityDetail';
import { activityAPI } from '../utils/api';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [userCompletion, setUserCompletion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await activityAPI.getActivity(id);
      setActivity(response.data.activity);
      setUserCompletion(response.data.userCompletion);
    } catch (err) {
      console.error('Error fetching activity:', err);
      setError('Failed to load activity. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const handleComplete = async (activityId, completionData) => {
    try {
      await activityAPI.completeActivity(activityId, completionData);
      
      // Show success message
      alert('Activity completed successfully! 🎉');
      
      // Navigate back to activities page
      navigate('/activities');
    } catch (err) {
      console.error('Error completing activity:', err);
      alert('Failed to complete activity. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/activities');
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
              onClick={fetchActivity}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
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
      <ActivityDetail
        activity={activity}
        onComplete={handleComplete}
        onBack={handleBack}
        loading={loading}
        userCompletion={userCompletion}
      />
    </div>
  );
};

export default ActivityDetailPage;