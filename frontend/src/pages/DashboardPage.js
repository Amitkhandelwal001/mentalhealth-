import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

const DashboardPage = () => {
  const { user, logout } = useAuth();

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
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Your Dashboard! 🎉
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  You have successfully logged in to MindCare.
                </p>
                
                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
                  <div className="space-y-3 text-left">
                    <div>
                      <span className="font-medium text-gray-600">Username:</span>
                      <span className="ml-2 text-gray-900">{user?.username}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{user?.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Display Name:</span>
                      <span className="ml-2 text-gray-900">{user?.profile?.displayName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Member since:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(user?.profile?.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Current streak:</span>
                      <span className="ml-2 text-gray-900">{user?.stats?.currentStreak || 0} days</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Total check-ins:</span>
                      <span className="ml-2 text-gray-900">{user?.stats?.totalCheckIns || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Points:</span>
                      <span className="ml-2 text-gray-900">{user?.stats?.points || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Level:</span>
                      <span className="ml-2 text-gray-900">{user?.stats?.level || 1}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-gray-600 mb-4">
                    🚧 This is a placeholder dashboard. Week 3-4 will add:
                  </p>
                  <ul className="text-left list-disc list-inside text-gray-600 max-w-md mx-auto space-y-1">
                    <li>Daily mood check-in</li>
                    <li>Mood tracking charts</li>
                    <li>Activity recommendations</li>
                    <li>Progress visualization</li>
                    <li>Streak counters</li>
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