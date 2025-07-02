import axios from 'axios';

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 100) {
      errors.push('Password must be less than 100 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    score: calculatePasswordScore(password)
  };
};

/**
 * Calculate password strength score
 * @param {string} password - Password to score
 * @returns {number} Score from 0-4
 */
const calculatePasswordScore = (password) => {
  if (!password) return 0;
  
  let score = 0;
  
  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character types
  if (/(?=.*[a-z])/.test(password)) score++;
  if (/(?=.*[A-Z])/.test(password)) score++;
  if (/(?=.*\d)/.test(password)) score++;
  if (/(?=.*[!@#$%^&*])/.test(password)) score++;
  
  return Math.min(score, 4);
};

/**
 * Get password strength text
 * @param {number} score - Password score
 * @returns {Object} Strength info
 */
export const getPasswordStrength = (score) => {
  const strengthMap = {
    0: { text: 'Very Weak', color: 'text-red-500', bgColor: 'bg-red-500' },
    1: { text: 'Weak', color: 'text-red-400', bgColor: 'bg-red-400' },
    2: { text: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    3: { text: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    4: { text: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500' }
  };
  
  return strengthMap[score] || strengthMap[0];
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username) {
    errors.push('Username is required');
  } else {
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    if (username.length > 20) {
      errors.push('Username must be less than 20 characters long');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate registration form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result
 */
export const validateRegistrationForm = (formData) => {
  const { username, email, password, confirmPassword } = formData;
  const errors = {};
  
  // Username validation
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.errors;
  }
  
  // Email validation
  if (!email) {
    errors.email = ['Email is required'];
  } else if (!validateEmail(email)) {
    errors.email = ['Please enter a valid email address'];
  }
  
  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }
  
  // Confirm password validation
  if (!confirmPassword) {
    errors.confirmPassword = ['Please confirm your password'];
  } else if (password !== confirmPassword) {
    errors.confirmPassword = ['Passwords do not match'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate login form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result
 */
export const validateLoginForm = (formData) => {
  const { emailOrUsername, password } = formData;
  const errors = {};
  
  if (!emailOrUsername) {
    errors.emailOrUsername = ['Email or username is required'];
  }
  
  if (!password) {
    errors.password = ['Password is required'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format API error response
 * @param {Object} error - Axios error object
 * @returns {Object} Formatted error
 */
export const formatApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.errors || []
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      errors: []
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      errors: []
    };
  }
};

/**
 * Set auth token in axios headers
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Store token in localStorage
 * @param {string} token - JWT token
 */
export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  const token = getStoredToken();
  if (!token) return false;
  
  try {
    // Basic token format check
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * Get user data from token
 * @returns {Object|null} User data or null
 */
export const getUserFromToken = () => {
  const token = getStoredToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
};

/**
 * API request helper with error handling
 * @param {Function} apiCall - Axios API call function
 * @returns {Object} API response
 */
export const apiRequest = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const formattedError = formatApiError(error);
    return {
      success: false,
      error: formattedError.message,
      errors: formattedError.errors,
      status: formattedError.status
    };
  }
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}; 