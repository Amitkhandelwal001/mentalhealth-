import React from 'react';

const StreakCounter = ({ currentStreak, longestStreak, loading = false }) => {
  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your journey!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "On fire!";
    if (streak < 100) return "Incredible dedication!";
    return "Legendary streaker!";
  };

  const getStreakColor = (streak) => {
    if (streak === 0) return "text-gray-500";
    if (streak < 7) return "text-yellow-600";
    if (streak < 30) return "text-orange-600";
    if (streak < 100) return "text-red-600";
    return "text-purple-600";
  };

  const getStreakBgColor = (streak) => {
    if (streak === 0) return "bg-gray-100";
    if (streak < 7) return "bg-yellow-100";
    if (streak < 30) return "bg-orange-100";
    if (streak < 100) return "bg-red-100";
    return "bg-purple-100";
  };

  const getStreakIcon = (streak) => {
    if (streak === 0) return "🎯";
    if (streak < 7) return "🔥";
    if (streak < 30) return "🚀";
    if (streak < 100) return "💎";
    return "🏆";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Streak Counter</h3>
        <span className="text-2xl">{getStreakIcon(currentStreak)}</span>
      </div>
      
      <div className="space-y-4">
        {/* Current Streak */}
        <div className={`${getStreakBgColor(currentStreak)} rounded-lg p-4 text-center`}>
          <div className={`text-4xl font-bold ${getStreakColor(currentStreak)} mb-2`}>
            {currentStreak}
          </div>
          <div className="text-sm text-gray-600 mb-1">Current Streak</div>
          <div className={`text-sm font-medium ${getStreakColor(currentStreak)}`}>
            {getStreakMessage(currentStreak)}
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Personal Best:</span>
          <span className="font-semibold text-gray-800 flex items-center">
            <span className="text-lg mr-1">🏅</span>
            {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Next milestone:</span>
            <span className="font-medium text-gray-800">
              {currentStreak < 7 ? '7 days' : 
               currentStreak < 30 ? '30 days' : 
               currentStreak < 100 ? '100 days' : '1 year'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStreak < 7 ? 'bg-yellow-500' : 
                currentStreak < 30 ? 'bg-orange-500' : 
                currentStreak < 100 ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{
                width: `${
                  currentStreak < 7 ? (currentStreak / 7) * 100 : 
                  currentStreak < 30 ? ((currentStreak - 7) / 23) * 100 : 
                  currentStreak < 100 ? ((currentStreak - 30) / 70) * 100 : 
                  ((currentStreak - 100) / 265) * 100
                }%`
              }}
            />
          </div>
        </div>

        {/* Motivation message */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-sm text-blue-800">
            {currentStreak === 0 ? 
              "Start tracking your mood today!" :
              `Keep it up! You're ${
                currentStreak < 7 ? 7 - currentStreak : 
                currentStreak < 30 ? 30 - currentStreak : 
                currentStreak < 100 ? 100 - currentStreak : 
                365 - currentStreak
              } days away from your next milestone!`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter; 