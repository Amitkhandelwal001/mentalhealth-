// Community data utilities and constants

// Post categories with icons and descriptions
export const postCategories = [
  {
    id: 'all',
    name: 'All Posts',
    icon: '📄',
    description: 'View all community posts',
    color: 'bg-gray-50 text-gray-700'
  },
  {
    id: 'support',
    name: 'Support',
    icon: '🤝',
    description: 'Seeking or offering support',
    color: 'bg-blue-50 text-blue-700'
  },
  {
    id: 'celebration',
    name: 'Celebration',
    icon: '🎉',
    description: 'Share your victories and achievements',
    color: 'bg-green-50 text-green-700'
  },
  {
    id: 'question',
    name: 'Question',
    icon: '❓',
    description: 'Ask questions and get answers',
    color: 'bg-purple-50 text-purple-700'
  },
  {
    id: 'general',
    name: 'General',
    icon: '💬',
    description: 'General discussion and thoughts',
    color: 'bg-orange-50 text-orange-700'
  }
];

// Sort options for posts
export const sortOptions = [
  {
    value: 'newest',
    label: 'Newest First',
    icon: '🕐'
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    icon: '⏰'
  },
  {
    value: 'popular',
    label: 'Most Popular',
    icon: '❤️'
  },
  {
    value: 'discussed',
    label: 'Most Discussed',
    icon: '💬'
  }
];

// Common tags for posts
export const commonTags = [
  'anxiety', 'depression', 'stress', 'self-care', 'motivation',
  'therapy', 'meditation', 'exercise', 'sleep', 'work',
  'relationships', 'family', 'friends', 'school', 'health',
  'goals', 'progress', 'setback', 'breakthrough', 'gratitude'
];

// Crisis keywords (for frontend detection)
export const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'self harm', 'cutting',
  'overdose', 'want to die', 'better off dead', 'no point',
  'give up', 'cant take it', 'end my life'
];

// Crisis resources
export const crisisResources = {
  message: "We noticed your post might indicate you're going through a difficult time. Please know that you're not alone and help is available.",
  resources: [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 free and confidential support"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis counseling via text"
    },
    {
      name: "International Association for Suicide Prevention",
      website: "https://www.iasp.info/resources/Crisis_Centres/",
      description: "Crisis centers worldwide"
    }
  ]
};

/**
 * Get category information by ID
 * @param {string} categoryId - Category ID
 * @returns {object} Category information
 */
export const getCategoryInfo = (categoryId) => {
  return postCategories.find(cat => cat.id === categoryId) || postCategories[0];
};

/**
 * Get sort option information by value
 * @param {string} sortValue - Sort value
 * @returns {object} Sort option information
 */
export const getSortInfo = (sortValue) => {
  return sortOptions.find(opt => opt.value === sortValue) || sortOptions[0];
};

/**
 * Format time ago from timestamp
 * @param {string|Date} timestamp - Timestamp
 * @returns {string} Formatted time ago
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}mo ago`;
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Extract hashtags from text
 * @param {string} text - Text to extract hashtags from
 * @returns {array} Array of hashtags
 */
export const extractHashtags = (text) => {
  const hashtags = text.match(/#[a-zA-Z0-9_]+/g);
  return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
};

/**
 * Check if text contains crisis keywords
 * @param {string} text - Text to check
 * @returns {boolean} True if crisis keywords found
 */
export const containsCrisisKeywords = (text) => {
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

/**
 * Validate post content
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @returns {object} Validation result
 */
export const validatePost = (title, content) => {
  const errors = [];

  if (!title.trim()) {
    errors.push('Title is required');
  } else if (title.length < 5) {
    errors.push('Title must be at least 5 characters long');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!content.trim()) {
    errors.push('Content is required');
  } else if (content.length < 10) {
    errors.push('Content must be at least 10 characters long');
  } else if (content.length > 2000) {
    errors.push('Content must be less than 2000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format post statistics
 * @param {number} likes - Number of likes
 * @param {number} comments - Number of comments
 * @returns {object} Formatted statistics
 */
export const formatPostStats = (likes, comments) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return {
    likes: formatNumber(likes),
    comments: formatNumber(comments),
    likesLabel: likes === 1 ? 'like' : 'likes',
    commentsLabel: comments === 1 ? 'comment' : 'comments'
  };
};

/**
 * Get placeholder content for empty states
 * @param {string} category - Category ID
 * @returns {object} Placeholder content
 */
export const getEmptyStatePlaceholder = (category = 'all') => {
  const placeholders = {
    all: {
      title: 'No posts yet',
      message: 'Be the first to share something with the community!',
      icon: '📝'
    },
    support: {
      title: 'No support posts yet',
      message: 'Share your experiences or offer support to others',
      icon: '🤝'
    },
    celebration: {
      title: 'No celebrations yet',
      message: 'Share your victories and achievements with the community!',
      icon: '🎉'
    },
    question: {
      title: 'No questions yet',
      message: 'Ask questions and get answers from the community',
      icon: '❓'
    },
    general: {
      title: 'No general posts yet',
      message: 'Start a conversation with the community',
      icon: '💬'
    }
  };

  return placeholders[category] || placeholders.all;
}; 