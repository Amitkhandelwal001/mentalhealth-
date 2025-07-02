import React, { useState, useEffect, useCallback } from 'react';
import { moodAPI, handleApiError } from '../../utils/api';
import MoodCard from './MoodCard';

const MoodList = ({ 
  userId, 
  limit = 10, 
  showActions = false, 
  onEdit, 
  onDelete,
  refreshTrigger = 0 
}) => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMoodEntries = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError('');
      }

      const response = await moodAPI.getMoodEntries({
        page: pageNum,
        limit,
        sort: '-createdAt' // Most recent first
      });

      const { data: entries, pagination } = response.data;

      // Ensure entries is an array
      const safeEntries = Array.isArray(entries) ? entries : [];

      if (isLoadMore) {
        setMoodEntries(prev => [...(prev || []), ...safeEntries]);
      } else {
        setMoodEntries(safeEntries);
      }

      setHasMore(pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching mood entries:', err);
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchMoodEntries();
  }, [refreshTrigger, fetchMoodEntries]);

  const handleLoadMore = () => {
    fetchMoodEntries(page + 1, true);
  };

  const handleEdit = async (moodEntry) => {
    if (onEdit) {
      onEdit(moodEntry);
    }
  };

  const handleDelete = async (moodEntry) => {
    if (onDelete) {
      try {
        await moodAPI.deleteMoodEntry(moodEntry._id);
        
        // Remove from local state
        setMoodEntries(prev => (prev || []).filter(entry => entry._id !== moodEntry._id));
        
        if (onDelete) {
          onDelete(moodEntry);
        }
      } catch (err) {
        console.error('Error deleting mood entry:', err);
        const apiError = handleApiError(err);
        setError(apiError.message);
      }
    }
  };

  if (loading && (!moodEntries || moodEntries.length === 0)) {
    return (
      <div className="space-y-4">
        {/* Loading skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-600 text-sm">❌</span>
          <span className="text-red-700 text-sm ml-2">{error}</span>
        </div>
        <button
          onClick={() => fetchMoodEntries()}
          className="mt-2 text-red-600 hover:text-red-700 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (moodEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">😊</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries yet</h3>
        <p className="text-gray-600 mb-4">
          Start tracking your mood to see your emotional patterns over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mood entries list */}
      {Array.isArray(moodEntries) && moodEntries.map((entry) => (
        <MoodCard
          key={entry._id}
          moodEntry={entry}
          showActions={showActions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Load more button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* No more entries message */}
      {!hasMore && moodEntries && moodEntries.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-gray-500 text-sm">You've reached the end of your mood history</p>
        </div>
      )}
    </div>
  );
};

export default MoodList; 