import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoodCheckIn from '../components/forms/MoodCheckIn';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-800">MindCare</h1>
          </div>
          
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <MoodCheckIn 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Why track your mood?
          </h3>
          <p className="text-blue-700 leading-relaxed">
            Regular mood tracking helps you identify patterns, triggers, and trends in your emotional well-being. 
            This insight can be valuable for understanding what affects your mental health and making positive changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckInPage; 