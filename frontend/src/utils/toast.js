import { toast } from 'react-toastify';

// Toast configuration with MindCare styling
const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// Success toast for general operations
export const showSuccessToast = (message) => {
  toast.success(message, {
    ...toastConfig,
    className: 'toast-success',
  });
};

// Error toast for general failures
export const showErrorToast = (message) => {
  toast.error(message, {
    ...toastConfig,
    className: 'toast-error',
  });
};

// Warning toast for important notices
export const showWarningToast = (message) => {
  toast.warning(message, {
    ...toastConfig,
    className: 'toast-warning',
  });
};

// Info toast for general information
export const showInfoToast = (message) => {
  toast.info(message, {
    ...toastConfig,
    className: 'toast-info',
  });
};

// Specific toasts for MindCare features

// Authentication toasts
export const showAuthSuccess = (action) => {
  const messages = {
    login: '🎉 Welcome back! You\'re successfully logged in.',
    register: '🌟 Account created successfully! Welcome to MindCare.',
    logout: '👋 You\'ve been logged out successfully.'
  };
  showSuccessToast(messages[action] || 'Authentication successful!');
};

export const showAuthError = (error) => {
  const commonErrors = {
    'Invalid credentials': '🔒 Invalid email or password. Please try again.',
    'User already exists': '📧 An account with this email already exists.',
    'Network Error': '🌐 Connection error. Please check your internet connection.',
    'Token expired': '⏰ Your session has expired. Please log in again.'
  };
  
  const message = commonErrors[error] || `❌ Authentication failed: ${error}`;
  showErrorToast(message);
};

// Mood tracking toasts
export const showMoodSuccess = (action) => {
  const messages = {
    create: '😊 Mood entry saved successfully! Keep tracking your journey.',
    update: '✏️ Mood entry updated successfully!',
    delete: '🗑️ Mood entry deleted successfully.'
  };
  showSuccessToast(messages[action] || 'Mood action completed!');
};

export const showMoodError = (error) => {
  const message = error.includes('duplicate') 
    ? '📅 You\'ve already logged your mood for this time of day.'
    : `😔 Failed to save mood entry: ${error}`;
  showErrorToast(message);
};

// Activity toasts
export const showActivitySuccess = (action, activityName) => {
  const messages = {
    complete: `🎯 Great job! You completed "${activityName}". Keep up the good work!`,
    start: `🚀 Starting "${activityName}". Take your time and focus on yourself.`,
    rate: '⭐ Thank you for rating this activity!'
  };
  showSuccessToast(messages[action] || 'Activity action completed!');
};

export const showActivityError = (error) => {
  showErrorToast(`🏃‍♀️ Activity error: ${error}`);
};

// Community toasts
export const showCommunitySuccess = (action) => {
  const messages = {
    post: '📝 Your post has been shared anonymously with the community!',
    comment: '💬 Your comment has been added successfully!',
    like: '❤️ Thanks for showing support!',
    unlike: '💙 Like removed.',
    flag: '🚩 Content has been flagged for review. Thank you for keeping our community safe.',
    delete: '🗑️ Content deleted successfully.'
  };
  showSuccessToast(messages[action] || 'Community action completed!');
};

export const showCommunityError = (error) => {
  const message = error.includes('inappropriate') 
    ? '🛡️ Content contains inappropriate language. Please revise and try again.'
    : `🤝 Community error: ${error}`;
  showErrorToast(message);
};

// Crisis support toasts
export const showCrisisAlert = () => {
  toast.error('🆘 We detected you might need support. Crisis resources are displayed below. You\'re not alone.', {
    ...toastConfig,
    autoClose: 8000,
    className: 'toast-crisis',
  });
};

// Gamification toasts
export const showPointsEarned = (points, action) => {
  toast.success(`🏆 +${points} points for ${action}! Keep up the great work!`, {
    ...toastConfig,
    autoClose: 3000,
    className: 'toast-points',
  });
};

export const showAchievementUnlocked = (achievement) => {
  toast.success(`🎉 Achievement Unlocked: ${achievement}!`, {
    ...toastConfig,
    autoClose: 6000,
    className: 'toast-achievement',
  });
};

export const showStreakMilestone = (days) => {
  toast.success(`🔥 Amazing! You've maintained a ${days}-day streak!`, {
    ...toastConfig,
    autoClose: 5000,
    className: 'toast-streak',
  });
};

// Network and loading toasts
export const showLoadingToast = (message = 'Loading...') => {
  return toast.loading(message, {
    ...toastConfig,
    className: 'toast-loading',
  });
};

export const updateLoadingToast = (toastId, type, message) => {
  const updateConfig = {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 4000,
    className: `toast-${type}`,
  };
  
  toast.update(toastId, updateConfig);
};

export const showNetworkError = () => {
  showErrorToast('🌐 Network error. Please check your connection and try again.');
};

// Data operation toasts
export const showDataSuccess = (operation) => {
  const messages = {
    save: '💾 Data saved successfully!',
    load: '📊 Data loaded successfully!',
    sync: '🔄 Data synchronized successfully!',
    export: '📁 Data exported successfully!',
    import: '📥 Data imported successfully!'
  };
  showSuccessToast(messages[operation] || 'Data operation completed!');
};

export const showDataError = (operation, error) => {
  showErrorToast(`📊 Failed to ${operation} data: ${error}`);
};

// Form validation toasts
export const showValidationError = (field) => {
  const messages = {
    email: '📧 Please enter a valid email address.',
    password: '🔒 Password must be at least 6 characters long.',
    username: '👤 Username must be 3-20 characters long.',
    required: '📝 Please fill in all required fields.',
    mood: '😊 Please select your mood before saving.',
    content: '✏️ Please enter some content before posting.'
  };
  showWarningToast(messages[field] || 'Please check your input and try again.');
};

// Maintenance toasts
export const showMaintenanceNotice = () => {
  showInfoToast('🔧 Scheduled maintenance in progress. Some features may be temporarily unavailable.');
};

export const showFeatureComingSoon = (feature) => {
  showInfoToast(`🚀 ${feature} is coming soon! Stay tuned for updates.`);
};

// Session management toasts
export const showSessionWarning = () => {
  showWarningToast('⏰ Your session will expire in 5 minutes. Save your work!');
};

export const showSessionExpired = () => {
  showErrorToast('⏰ Your session has expired. Please log in again to continue.');
};

// Quick action toasts
export const showQuickSuccess = (action) => {
  toast.success(`✅ ${action}`, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    className: 'toast-quick',
  });
};

// Accessibility helper for screen readers
export const announceToScreenReader = (message) => {
  // This creates an announcement for screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Batch operations
export const showBatchOperationStart = (operation, count) => {
  return showLoadingToast(`Processing ${count} items...`);
};

export const showBatchOperationComplete = (toastId, operation, count, failed = 0) => {
  const message = failed > 0 
    ? `${operation} completed: ${count - failed} successful, ${failed} failed`
    : `${operation} completed successfully for ${count} items`;
  
  updateLoadingToast(toastId, failed > 0 ? 'warning' : 'success', message);
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  loading: showLoadingToast,
  update: updateLoadingToast,
  
  // Feature-specific
  auth: { success: showAuthSuccess, error: showAuthError },
  mood: { success: showMoodSuccess, error: showMoodError },
  activity: { success: showActivitySuccess, error: showActivityError },
  community: { success: showCommunitySuccess, error: showCommunityError },
  
  // Special
  crisis: showCrisisAlert,
  points: showPointsEarned,
  achievement: showAchievementUnlocked,
  streak: showStreakMilestone,
  validation: showValidationError,
  quick: showQuickSuccess,
  
  // Screen reader
  announce: announceToScreenReader
}; 