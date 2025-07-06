import React from 'react';
import { 
  getActivityIcon, 
  getActivityColor, 
  getCategoryInfo, 
  getDifficultyInfo, 
  formatDuration,
  getPointsForActivity
} from '../../utils/activityData';

const ActivityCard = ({ 
  activity, 
  onStartActivity, 
  onViewDetails, 
  isCompleted = false,
  showPoints = true,
  className = '' 
}) => {
  const categoryInfo = getCategoryInfo(activity.category);
  const difficultyInfo = getDifficultyInfo(activity.difficultyLevel);
  const icon = getActivityIcon(activity);
  const color = getActivityColor(activity);
  const points = getPointsForActivity(activity);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600">
                {categoryInfo.name}
              </p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <span className="text-sm">✓</span>
              <span className="text-xs">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {activity.description}
        </p>

        {/* Activity Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            {/* Duration */}
            <div className="flex items-center space-x-1 text-gray-600">
              <span>⏱️</span>
              <span>{formatDuration(activity.duration)}</span>
            </div>

            {/* Difficulty */}
            <div className="flex items-center space-x-1">
              <span style={{ color: difficultyInfo.color }}>
                {difficultyInfo.icon}
              </span>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${difficultyInfo.color}20`,
                  color: difficultyInfo.color
                }}
              >
                {difficultyInfo.name}
              </span>
            </div>
          </div>

          {/* Points */}
          {showPoints && (
            <div className="flex items-center space-x-1 text-indigo-600">
              <span className="text-sm">🏆</span>
              <span className="text-sm font-medium">{points} pts</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {activity.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {activity.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                +{activity.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onStartActivity(activity)}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
          >
            Start Activity
          </button>
          <button
            onClick={() => onViewDetails(activity)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard; 