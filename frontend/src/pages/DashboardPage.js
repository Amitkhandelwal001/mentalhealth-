import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MoodList from '../components/common/MoodList';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Check for success message from mood check-in
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setShowMessage(true);
      
      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      // Clear the location state
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl">🧠</span>
                  <h1 className="ml-2 text-xl font-bold text-gray-900">MindCare</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.username}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Success Message */}
            {showMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="text-xl mr-3">✅</span>
                <span>{message}</span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mood Check-in Card */}
                <Link
                  to="/mood-checkin"
                  className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">😊</span>
                    <h3 className="text-xl font-semibold">Log Your Mood</h3>
                  </div>
                  <p className="text-blue-100">
                    Track how you're feeling today and build your emotional awareness
                  </p>
                </Link>

                {/* View History Card */}
                <Link
                  to="/mood-history"
                  className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">📊</span>
                    <h3 className="text-xl font-semibold">View History</h3>
                  </div>
                  <p className="text-green-100">
                    See your mood patterns and trends over time
                  </p>
                </Link>

                {/* Activities Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">🎯</span>
                    <h3 className="text-xl font-semibold">Activities</h3>
                  </div>
                  <p className="text-purple-100">
                    Discover personalized activities to boost your mood
                  </p>
                  <p className="text-purple-200 text-sm mt-2">Coming soon...</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Stats */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {user?.profile?.displayName}! 🎉
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Here's your mental health journey overview.
                </p>
                
                {/* Progress Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{user?.stats?.currentStreak || 0}</div>
                      <div className="text-sm text-gray-600">Current Streak</div>
                      <div className="text-xs text-gray-500">days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{user?.stats?.totalCheckIns || 0}</div>
                      <div className="text-sm text-gray-600">Total Check-ins</div>
                      <div className="text-xs text-gray-500">mood entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{user?.stats?.points || 0}</div>
                      <div className="text-sm text-gray-600">Points Earned</div>
                      <div className="text-xs text-gray-500">total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{user?.stats?.level || 1}</div>
                      <div className="text-sm text-gray-600">Current Level</div>
                      <div className="text-xs text-gray-500">level</div>
                    </div>
                  </div>
                </div>

                {/* Recent Mood Entries */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Mood Entries</h3>
                    <Link 
                      to="/mood-history"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All →
                    </Link>
                  </div>
                  <MoodList 
                    limit={3}
                    showActions={false}
                  />
                </div>
              </div>

              {/* Profile Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{user?.profile?.avatar || '😊'}</span>
                      <div>
                        <div className="font-medium text-gray-900">{user?.profile?.displayName}</div>
                        <div className="text-sm text-gray-600">@{user?.username}</div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="text-sm text-gray-600">Member since</div>
                      <div className="text-gray-900">
                        {new Date(user?.profile?.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Log your mood daily to build awareness</li>
                    <li>• Track patterns in your emotional health</li>
                    <li>• Use tags to identify mood triggers</li>
                    <li>• Maintain streaks for better insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage; 