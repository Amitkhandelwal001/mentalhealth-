import axios from 'axios';

// API base URL configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default apiClient;

// Mood API endpoints
export const moodAPI = {
  // Get mood entries with pagination
  getMoodEntries: (params = {}) => 
    apiClient.get('/mood', { params }),
  
  // Create a new mood entry
  createMoodEntry: (data) => 
    apiClient.post('/mood', data),
  
  // Get a specific mood entry
  getMoodEntry: (id) => 
    apiClient.get(`/mood/${id}`),
  
  // Update a mood entry
  updateMoodEntry: (id, data) => 
    apiClient.put(`/mood/${id}`, data),
  
  // Delete a mood entry
  deleteMoodEntry: (id) => 
    apiClient.delete(`/mood/${id}`),
  
  // Get mood statistics
  getMoodStats: (params = {}) => 
    apiClient.get('/mood/stats', { params }),
  
  // Get mood trends for charts
  getMoodTrends: (params = {}) => 
    apiClient.get('/mood/trends', { params }),
};

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: (data) => 
    apiClient.post('/auth/register', data),
  
  // Login user
  login: (data) => 
    apiClient.post('/auth/login', data),
  
  // Get current user
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
  
  // Logout user
  logout: () => 
    apiClient.post('/auth/logout'),
  
  // Update user profile
  updateProfile: (data) => 
    apiClient.put('/auth/profile', data),
};

// Helper function for handling API errors
export const handleApiError = (error) => {
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

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  try {
    const { method = 'GET', data = null, params = {} } = options;
    
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      params,
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Dashboard API functions
export const getDashboardData = async (timeframe = '30d') => {
  try {
    const response = await apiClient.get(`/mood/dashboard?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getMoodTrends = async (period = 'week') => {
  try {
    const response = await apiClient.get(`/mood/trends?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mood trends:', error);
    throw error;
  }
};

export const getMoodStats = async (timeframe = '30d') => {
  try {
    const response = await apiClient.get(`/mood/stats?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    throw error;
  }
};

// Activity API endpoints
export const activityAPI = {
  // Get all activities with optional filtering
  getActivities: (params = {}) => 
    apiClient.get('/activities', { params }),
  
  // Get a specific activity
  getActivity: (id) => 
    apiClient.get(`/activities/${id}`),
  
  // Get recommended activities
  getRecommendedActivities: (params = {}) => 
    apiClient.get('/activities/recommendations', { params }),
  
  // Mark activity as complete
  completeActivity: (id, data = {}) => 
    apiClient.post(`/activities/${id}/complete`, data),
  
  // Get user's activity history
  getActivityHistory: (params = {}) => 
    apiClient.get('/activities/history', { params }),
};

// Community API endpoints
export const communityAPI = {
  // Get community posts with pagination and filtering
  getPosts: (params = {}) => 
    apiClient.get('/community/posts', { params }),
  
  // Get a specific post
  getPost: (id) => 
    apiClient.get(`/community/posts/${id}`),
  
  // Create a new post
  createPost: (data) => 
    apiClient.post('/community/posts', data),
  
  // Like or unlike a post
  likePost: (id) => 
    apiClient.post(`/community/posts/${id}/like`),
  
  // Flag a post as inappropriate
  flagPost: (id, data = {}) => 
    apiClient.post(`/community/posts/${id}/flag`, data),
  
  // Get community statistics
  getCommunityStats: () => 
    apiClient.get('/community/stats'),
  
  // Add a comment to a post
  addComment: (postId, data) => 
    apiClient.post(`/community/posts/${postId}/comments`, data),
  
  // Get comments for a post
  getComments: (postId, params = {}) => 
    apiClient.get(`/community/posts/${postId}/comments`, { params }),
  
  // Like or unlike a comment
  likeComment: (commentId) => 
    apiClient.post(`/community/comments/${commentId}/like`),
  
  // Flag a comment as inappropriate
  flagComment: (commentId, data = {}) => 
    apiClient.post(`/community/comments/${commentId}/flag`, data),
  
  // Delete a comment (author only)
  deleteComment: (commentId) => 
    apiClient.delete(`/community/comments/${commentId}`),
}; 