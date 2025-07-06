import React from 'react';
import { getMoodEmoji, getMoodLabel } from '../../utils/moodData';

const MoodSummary = ({ stats, trends, loading = false }) => {
  const getMoodTrendIcon = (trend) => {
    if (trend > 0.3) return "📈"; // Improving
    if (trend < -0.3) return "📉"; // Declining
    return "➖"; // Stable
  };

  const getMoodTrendText = (trend) => {
    if (trend > 0.5) return "Significantly improving";
    if (trend > 0.3) return "Improving";
    if (trend > 0.1) return "Slightly improving";
    if (trend < -0.5) return "Needs attention";
    if (trend < -0.3) return "Declining";
    if (trend < -0.1) return "Slightly declining";
    return "Stable";
  };

  const getMoodTrendColor = (trend) => {
    if (trend > 0.3) return "text-green-600";
    if (trend < -0.3) return "text-red-600";
    return "text-gray-600";
  };

  const calculateMoodTrend = () => {
    if (!trends || trends.length < 2) return 0;
    
    const recent = trends.slice(-3).reduce((sum, day) => sum + day.averageMood, 0) / 3;
    const earlier = trends.slice(0, 3).reduce((sum, day) => sum + day.averageMood, 0) / 3;
    
    return recent - earlier;
  };

  const getTopMood = () => {
    if (!stats || !stats.moodDistribution) return null;
    
    const distribution = stats.moodDistribution;
    
    // Handle if distribution is an object (from getUserStats)
    if (typeof distribution === 'object' && !Array.isArray(distribution)) {
      let topMood = null;
      let maxCount = 0;
      
      for (const [moodScore, count] of Object.entries(distribution)) {
        if (count > maxCount) {
          maxCount = count;
          topMood = {
            _id: parseInt(moodScore),
            count: count
          };
        }
      }
      
      return topMood && topMood.count > 0 ? topMood : null;
    }
    
    // Handle if distribution is an array (from dashboard aggregation)
    if (Array.isArray(distribution) && distribution.length > 0) {
      const topMood = distribution.reduce((max, current) => 
        current.count > max.count ? current : max
      );
      return topMood;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const moodTrend = calculateMoodTrend();
  const topMood = getTopMood();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Summary</h3>
      
      <div className="space-y-4">
        {/* Average Mood */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">
              {getMoodEmoji(Math.round(stats?.averageMood || 3))}
            </span>
            <div>
              <div className="font-medium text-gray-800">Average Mood</div>
              <div className="text-sm text-gray-600">
                {getMoodLabel(Math.round(stats?.averageMood || 3))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {(stats?.averageMood || 0).toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">out of 5</div>
          </div>
        </div>

        {/* Mood Trend */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">
              {getMoodTrendIcon(moodTrend)}
            </span>
            <div>
              <div className="font-medium text-gray-800">Recent Trend</div>
              <div className={`text-sm font-medium ${getMoodTrendColor(moodTrend)}`}>
                {getMoodTrendText(moodTrend)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getMoodTrendColor(moodTrend)}`}>
              {moodTrend > 0 ? '+' : ''}{moodTrend.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">7-day trend</div>
          </div>
        </div>

        {/* Most Common Mood */}
        {topMood && (
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {getMoodEmoji(topMood._id)}
              </span>
              <div>
                <div className="font-medium text-gray-800">Most Common</div>
                <div className="text-sm text-gray-600">
                  {getMoodLabel(topMood._id)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                {topMood.count}
              </div>
              <div className="text-xs text-gray-500">
                {topMood.count === 1 ? 'time' : 'times'}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {stats?.totalEntries || 0}
            </div>
            <div className="text-xs text-gray-600">Total Entries</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">
              {stats?.daysTracked || 0}
            </div>
            <div className="text-xs text-gray-600">Days Tracked</div>
          </div>
        </div>

        {/* Best Day */}
        {stats?.bestDay && (
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Best Day</div>
            <div className="flex items-center justify-center">
              <span className="text-lg mr-2">🌟</span>
              <span className="font-medium text-gray-800">
                {new Date(stats.bestDay).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodSummary; 