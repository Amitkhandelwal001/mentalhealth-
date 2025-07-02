// Mood data constants and utilities

/**
 * Mood options with scores, emojis, and labels
 */
export const MOOD_OPTIONS = [
  {
    value: 1,
    emoji: '😢',
    label: 'Very Sad',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    hoverColor: 'hover:bg-red-200',
    description: 'Feeling very down or distressed'
  },
  {
    value: 2,
    emoji: '😕',
    label: 'Sad',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    hoverColor: 'hover:bg-orange-200',
    description: 'Feeling low or upset'
  },
  {
    value: 3,
    emoji: '😐',
    label: 'Neutral',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    hoverColor: 'hover:bg-gray-200',
    description: 'Feeling okay or balanced'
  },
  {
    value: 4,
    emoji: '🙂',
    label: 'Happy',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    hoverColor: 'hover:bg-blue-200',
    description: 'Feeling good or positive'
  },
  {
    value: 5,
    emoji: '😊',
    label: 'Very Happy',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    hoverColor: 'hover:bg-green-200',
    description: 'Feeling excellent or joyful'
  }
];

/**
 * Time of day options
 */
export const TIME_OF_DAY_OPTIONS = [
  {
    value: 'morning',
    label: 'Morning',
    emoji: '🌅',
    description: 'Start of the day (6 AM - 12 PM)',
    timeRange: '6:00 AM - 12:00 PM'
  },
  {
    value: 'afternoon',
    label: 'Afternoon',
    emoji: '☀️',
    description: 'Middle of the day (12 PM - 6 PM)',
    timeRange: '12:00 PM - 6:00 PM'
  },
  {
    value: 'evening',
    label: 'Evening',
    emoji: '🌙',
    description: 'End of the day (6 PM - 12 AM)',
    timeRange: '6:00 PM - 12:00 AM'
  }
];

/**
 * Common mood tags/categories
 */
export const COMMON_MOOD_TAGS = [
  // Work-related
  'work', 'productivity', 'stress', 'deadline', 'meeting', 'project',
  
  // Personal life
  'family', 'friends', 'relationship', 'social', 'alone-time',
  
  // Health & wellness
  'exercise', 'sleep', 'energy', 'tired', 'sick', 'healthy',
  
  // Activities
  'reading', 'music', 'movies', 'gaming', 'cooking', 'shopping',
  
  // Weather/environment
  'sunny', 'rainy', 'home', 'outdoors', 'travel',
  
  // Emotions/feelings
  'anxious', 'calm', 'excited', 'grateful', 'frustrated', 'peaceful',
  'motivated', 'overwhelmed', 'confident', 'worried'
];

/**
 * Mood color mapping for charts
 */
export const MOOD_COLORS = {
  1: '#ef4444', // red-500
  2: '#f97316', // orange-500
  3: '#64748b', // gray-500
  4: '#3b82f6', // blue-500
  5: '#10b981'  // green-500
};

/**
 * Chart color scheme for mood visualization
 */
export const MOOD_CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#f97316',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  gradient: ['#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']
};

/**
 * Get mood option by score
 * @param {number} score - Mood score (1-5)
 * @returns {Object} Mood option object
 */
export const getMoodByScore = (score) => {
  return MOOD_OPTIONS.find(mood => mood.value === score) || MOOD_OPTIONS[2];
};

/**
 * Get time of day option by value
 * @param {string} timeOfDay - Time of day value
 * @returns {Object} Time of day option object
 */
export const getTimeOfDayByValue = (timeOfDay) => {
  return TIME_OF_DAY_OPTIONS.find(time => time.value === timeOfDay) || TIME_OF_DAY_OPTIONS[0];
};

/**
 * Get mood color by score
 * @param {number} score - Mood score (1-5)
 * @returns {string} Color hex code
 */
export const getMoodColor = (score) => {
  return MOOD_COLORS[score] || MOOD_COLORS[3];
};

/**
 * Calculate mood trend direction
 * @param {Array} moodEntries - Array of mood entries
 * @returns {string} Trend direction: 'up', 'down', 'stable'
 */
export const calculateMoodTrend = (moodEntries) => {
  if (!moodEntries || moodEntries.length < 2) return 'stable';
  
  const recent = moodEntries.slice(-7); // Last 7 entries
  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.ceil(recent.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 0.3) return 'up';
  if (difference < -0.3) return 'down';
  return 'stable';
};

/**
 * Get trend emoji and description
 * @param {string} trend - Trend direction
 * @returns {Object} Trend display object
 */
export const getTrendDisplay = (trend) => {
  const trendMap = {
    up: {
      emoji: '📈',
      text: 'Improving',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Your mood has been trending upward'
    },
    down: {
      emoji: '📉',
      text: 'Declining',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Your mood has been trending downward'
    },
    stable: {
      emoji: '➡️',
      text: 'Stable',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Your mood has been relatively stable'
    }
  };
  
  return trendMap[trend] || trendMap.stable;
};

/**
 * Format mood entry for display
 * @param {Object} entry - Mood entry object
 * @returns {Object} Formatted mood entry
 */
export const formatMoodEntry = (entry) => {
  if (!entry) return null;
  
  const mood = getMoodByScore(entry.moodScore);
  const timeOfDay = getTimeOfDayByValue(entry.timeOfDay);
  
  return {
    ...entry,
    moodDisplay: mood,
    timeOfDayDisplay: timeOfDay,
    formattedDate: new Date(entry.date).toLocaleDateString(),
    formattedTime: new Date(entry.createdAt).toLocaleTimeString(),
    timeAgo: getTimeAgo(new Date(entry.createdAt))
  };
};

/**
 * Get time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

/**
 * Validate mood entry data
 * @param {Object} data - Mood entry data
 * @returns {Object} Validation result
 */
export const validateMoodEntry = (data) => {
  const errors = {};
  
  // Validate mood score
  if (!data.moodScore || data.moodScore < 1 || data.moodScore > 5) {
    errors.moodScore = 'Please select a mood rating from 1 to 5';
  }
  
  // Validate time of day
  if (!data.timeOfDay || !['morning', 'afternoon', 'evening'].includes(data.timeOfDay)) {
    errors.timeOfDay = 'Please select a time of day';
  }
  
  // Validate notes length
  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Notes cannot exceed 500 characters';
  }
  
  // Validate tags
  if (data.tags && data.tags.length > 10) {
    errors.tags = 'Cannot have more than 10 tags';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get current time of day based on current time
 * @returns {string} Current time of day
 */
export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
};

/**
 * Get mood recommendations based on score
 * @param {number} score - Mood score
 * @returns {Array} Array of recommendation strings
 */
export const getMoodRecommendations = (score) => {
  const recommendations = {
    1: [
      'Consider talking to someone you trust',
      'Try some gentle breathing exercises',
      'Take a short walk if possible',
      'Practice self-compassion'
    ],
    2: [
      'Try journaling about your feelings',
      'Listen to calming music',
      'Do something small that makes you feel better',
      'Consider a warm bath or shower'
    ],
    3: [
      'This is a good baseline mood',
      'Consider what might lift your spirits',
      'Try a mindfulness exercise',
      'Engage in a hobby you enjoy'
    ],
    4: [
      'Great mood! Consider sharing the positivity',
      'This is a good time for productive activities',
      'Try something creative',
      'Connect with friends or family'
    ],
    5: [
      'Wonderful! You\'re feeling amazing',
      'Share your joy with others',
      'Take on a challenging but fun project',
      'Remember this feeling for future reference'
    ]
  };
  
  return recommendations[score] || recommendations[3];
}; 