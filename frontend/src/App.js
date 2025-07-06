import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Context Provider
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MoodCheckInPage from './pages/MoodCheckInPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import GetHelpPage from './pages/GetHelpPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation will be added later */}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mood-checkin" element={<MoodCheckInPage />} />
            <Route path="/mood-history" element={<MoodHistoryPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/history" element={<ActivityHistoryPage />} />
            <Route path="/activities/:id" element={<ActivityDetailPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/posts/:id" element={<PostDetailPage />} />
            <Route path="/get-help" element={<GetHelpPage />} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
