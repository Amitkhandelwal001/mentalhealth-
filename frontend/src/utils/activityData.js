// Activity categories with their properties
export const ACTIVITY_CATEGORIES = {
  breathing: {
    name: 'Breathing',
    icon: '🫁',
    color: '#3B82F6',
    description: 'Breathing exercises to reduce stress and improve focus'
  },
  journaling: {
    name: 'Journaling',
    icon: '📝',
    color: '#10B981',
    description: 'Writing exercises to process emotions and thoughts'
  },
  physical: {
    name: 'Physical',
    icon: '🏃',
    color: '#F59E0B',
    description: 'Movement and physical activities to boost energy'
  },
  mindfulness: {
    name: 'Mindfulness',
    icon: '🧘',
    color: '#8B5CF6',
    description: 'Mindfulness practices to increase awareness and presence'
  }
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  beginner: {
    name: 'Beginner',
    color: '#10B981',
    icon: '🌱',
    description: 'Easy to start with, no experience needed'
  },
  intermediate: {
    name: 'Intermediate',
    color: '#F59E0B',
    icon: '🌿',
    description: 'Some experience helpful, moderate challenge'
  },
  advanced: {
    name: 'Advanced',
    color: '#EF4444',
    icon: '🌳',
    description: 'Challenging, requires practice and experience'
  }
};

// Helper functions
export const getCategoryInfo = (category) => {
  return ACTIVITY_CATEGORIES[category] || {
    name: category,
    icon: '🔹',
    color: '#6B7280',
    description: 'Activity category'
  };
};

export const getDifficultyInfo = (difficulty) => {
  return DIFFICULTY_LEVELS[difficulty] || {
    name: difficulty,
    color: '#6B7280',
    icon: '🔹',
    description: 'Difficulty level'
  };
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
};

export const getActivityDescription = (activity) => {
  const category = getCategoryInfo(activity.category);
  const difficulty = getDifficultyInfo(activity.difficultyLevel);
  const duration = formatDuration(activity.duration);
  
  return `${category.name} • ${difficulty.name} • ${duration}`;
};

export const getPointsForActivity = (activity) => {
  const basePoints = 15;
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
  };
  
  return Math.round(basePoints * difficultyMultiplier[activity.difficultyLevel]);
};

export const getActivityIcon = (activity) => {
  return activity.icon || getCategoryInfo(activity.category).icon;
};

export const getActivityColor = (activity) => {
  return activity.color || getCategoryInfo(activity.category).color;
};