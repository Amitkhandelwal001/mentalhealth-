import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoodCheckIn from '../components/forms/MoodCheckIn';
import Navigation from '../components/common/Navigation';
import ProtectedRoute from '../components/common/ProtectedRoute';

const MoodCheckInPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (moodEntry) => {
    // Navigate to dashboard after successful mood entry
    navigate('/dashboard', { 
      state: { 
        message: 'Mood logged successfully!',
        moodEntry 
      }
    });
  };

  const handleCancel = () => {
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mood Check-In</h1>
            <p className="text-gray-600">Take a moment to reflect on how you're feeling</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <MoodCheckIn 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>

          {/* Help Text */}
          <div className="mt-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                💡 Why track your mood?
              </h3>
              <p className="text-blue-700 leading-relaxed">
                Regular mood tracking helps you identify patterns, triggers, and trends in your emotional well-being. 
                This insight can be valuable for understanding what affects your mental health and making positive changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MoodCheckInPage; 