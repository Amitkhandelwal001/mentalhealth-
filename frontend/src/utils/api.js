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