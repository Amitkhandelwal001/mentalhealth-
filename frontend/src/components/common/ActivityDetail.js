import React, { useState } from 'react';
import { 
  getActivityIcon, 
  getActivityColor, 
  getCategoryInfo, 
  getDifficultyInfo, 
  formatDuration,
  getPointsForActivity
} from '../../utils/activityData';

const ActivityDetail = ({ 
  activity, 
  onComplete, 
  onBack, 
  loading = false,
  userCompletion = null
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completionData, setCompletionData] = useState({
    rating: 0,
    notes: '',
    duration: activity?.duration || 0
  });
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  if (loading || !activity) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(activity.category);
  const difficultyInfo = getDifficultyInfo(activity.difficultyLevel);
  const icon = getActivityIcon(activity);
  const color = getActivityColor(activity);
  const points = getPointsForActivity(activity);

  const handleStartActivity = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < activity.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletionForm(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(activity._id, completionData);
  };

  const handleRatingChange = (rating) => {
    setCompletionData(prev => ({ ...prev, rating }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span>←</span>
          <span>Back to Activities</span>
        </button>
        
        {userCompletion && (
          <div className="flex items-center space-x-2 text-green-600">
            <span>✓</span>
            <span className="text-sm">Completed</span>
          </div>
        )}
      </div>

      {/* Activity Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-4 mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activity.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {activity.description}
            </p>
            
            {/* Activity Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <span>{categoryInfo.icon}</span>
                <span>{categoryInfo.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span style={{ color: difficultyInfo.color }}>
                  {difficultyInfo.icon}
                </span>
                <span 
                  className="px-2 py-1 rounded-full text-xs"
                  style={{ 
                    backgroundColor: `${difficultyInfo.color}20`,
                    color: difficultyInfo.color
                  }}
                >
                  {difficultyInfo.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-600">
                <span>⏱️</span>
                <span>{formatDuration(activity.duration)}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-indigo-600">
                <span>🏆</span>
                <span>{points} points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activity.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        {!isStarted && !showCompletionForm && (
          <button
            onClick={handleStartActivity}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Start Activity
          </button>
        )}
      </div>

      {/* Instructions */}
      {isStarted && !showCompletionForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {activity.instructions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / activity.instructions.length) * 100}%` }}
            ></div>
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="text-lg text-gray-900 mb-2">
              {activity.instructions[currentStep]}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              {currentStep === activity.instructions.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Completion Form */}
      {showCompletionForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Great job! How was the activity?
          </h2>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How helpful was this activity?
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl transition-colors duration-200 ${
                    star <= completionData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long did you spend? (minutes)
            </label>
            <input
              type="number"
              value={completionData.duration}
              onChange={(e) => setCompletionData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="1"
              max="240"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any thoughts or reflections? (optional)
            </label>
            <textarea
              value={completionData.notes}
              onChange={(e) => setCompletionData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="How did this activity make you feel? What did you learn?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleComplete}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Mark as Complete
            </button>
            <button
              onClick={() => setShowCompletionForm(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail; 