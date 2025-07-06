import React, { useState } from 'react';
import ActivityCard from './ActivityCard';
import { ACTIVITY_CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/activityData';

const ActivityList = ({ 
  activities = [], 
  onStartActivity, 
  onViewDetails, 
  loading = false,
  showFilters = true,
  completedActivityIds = [],
  title = "Activities",
  emptyMessage = "No activities found"
}) => {
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    search: ''
  });

  // Filter activities based on current filters
  const filteredActivities = activities.filter(activity => {
    const matchesCategory = filters.category === 'all' || activity.category === filters.category;
    const matchesDifficulty = filters.difficulty === 'all' || activity.difficultyLevel === filters.difficulty;
    const matchesSearch = !filters.search || 
      activity.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      difficulty: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.difficulty !== 'all' || filters.search !== '';

  if (loading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-10 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded flex-1"></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {activities.length > 0 && (
          <div className="text-sm text-gray-600">
            {filteredActivities.length} of {activities.length} activities
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && activities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Levels</option>
                {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                  <option key={key} value={key}>
                    {level.icon} {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search activities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onStartActivity={onStartActivity}
              onViewDetails={onViewDetails}
              isCompleted={completedActivityIds.includes(activity._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'No matching activities' : emptyMessage}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters 
              ? 'Try adjusting your filters to find more activities'
              : 'Activities will appear here when available'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityList; 