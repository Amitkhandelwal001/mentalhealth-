import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Navigation from '../components/common/Navigation';
import MoodLineChart from '../components/charts/MoodLineChart';
import WeeklyMoodChart from '../components/charts/WeeklyMoodChart';
import StreakCounter from '../components/common/StreakCounter';
import MoodSummary from '../components/common/MoodSummary';
import QuickMoodCheck from '../components/common/QuickMoodCheck';
import MoodList from '../components/common/MoodList';
import ActivityRecommendations from '../components/common/ActivityRecommendations';
import { getDashboardData } from '../utils/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [timeframe, setTimeframe] = useState('30d');

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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboardData(timeframe);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const handleLogout = async () => {
    await logout();
  };

  const handleMoodSubmitted = () => {
    // Refresh dashboard data when a new mood is submitted
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(timeframe);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error refreshing dashboard data:', err);
      }
    };
    
    fetchDashboardData();
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
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
          
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="h-80 bg-gray-200 rounded-lg"></div>
                    <div className="h-80 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

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

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="text-xl mr-3">❌</span>
                <span>{error}</span>
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {dashboardData?.user?.displayName || user?.username}! 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Here's your mental health journey overview
              </p>
            </div>

            {/* Timeframe Filter */}
            <div className="mb-6 flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              {['7d', '30d', '90d'].map((period) => (
                <button
                  key={period}
                  onClick={() => handleTimeframeChange(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </button>
              ))}
            </div>

            {/* Dashboard Grid - Completely Redesigned Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-4">
                {/* Top Row - Quick Actions & Streak */}
                <div className="space-y-4">
                  {/* Quick Mood Check - Full Width */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <QuickMoodCheck onMoodSubmitted={handleMoodSubmitted} />
                  </div>
                  
                  {/* Streak Counter - Full Width */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-4">
                    <StreakCounter 
                      currentStreak={dashboardData?.stats?.currentStreak || 0}
                      longestStreak={dashboardData?.stats?.longestStreak || 0}
                    />
                  </div>
                </div>

                {/* Charts Row - Much Larger */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <MoodLineChart 
                      data={dashboardData?.trends?.weekly || []} 
                      title="Weekly Mood Trends"
                      period="week"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <WeeklyMoodChart 
                      data={dashboardData?.trends?.monthly || []} 
                      title="Daily Mood Patterns"
                    />
                  </div>
                </div>

                {/* Bottom Row - Insights & Recent Entries */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Insights - Enhanced */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">💡</span>
                      Your Insights
                    </h3>
                    {dashboardData?.insights && dashboardData.insights.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardData.insights.slice(0, 4).map((insight, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border text-sm ${
                              insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                              insight.type === 'suggestion' ? 'bg-yellow-50 border-yellow-200' :
                              'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start">
                              <span className="text-lg mr-3">{insight.icon}</span>
                              <div>
                                <p className="text-gray-800 leading-relaxed">{insight.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {insight.type === 'positive' ? 'Great progress!' : 
                                   insight.type === 'suggestion' ? 'Recommendation' : 'Pattern detected'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <span className="text-4xl">🌱</span>
                        <p className="text-gray-600 mt-2">Keep tracking your mood to unlock insights!</p>
                      </div>
                    )}
                  </div>

                  {/* Recent Mood Entries - Enhanced */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-2xl mr-2">📅</span>
                        Recent Entries
                      </h3>
                      <Link 
                        to="/mood-history"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        View All →
                      </Link>
                    </div>
                    <MoodList 
                      limit={4}
                      showActions={false}
                      customData={dashboardData?.recentEntries}
                    />
                  </div>
                </div>

                {/* Profile Card - Horizontal Layout */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="text-2xl mr-2">👤</span>
                    Profile Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Profile Info */}
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center">
                        <div className="bg-white rounded-full p-4 shadow-sm mb-4">
                          <span className="text-4xl">{user?.profile?.avatar || '😊'}</span>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 text-lg">
                            {dashboardData?.user?.displayName || user?.username}
                          </div>
                          <div className="text-sm text-gray-600">@{user?.username}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Member since {dashboardData?.user?.joinDate ? 
                              new Date(dashboardData.user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
                              new Date(user?.profile?.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {dashboardData?.stats?.totalCheckIns || 0}
                          </div>
                          <div className="text-sm text-gray-600">Check-ins</div>
                          <div className="text-xs text-gray-500 mt-1">Total mood entries</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {dashboardData?.stats?.points || 0}
                          </div>
                          <div className="text-sm text-gray-600">Points</div>
                          <div className="text-xs text-gray-500 mt-1">Wellness score</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {dashboardData?.stats?.currentStreak || 0}
                          </div>
                          <div className="text-sm text-gray-600">Current Streak</div>
                          <div className="text-xs text-gray-500 mt-1">Days in a row</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {dashboardData?.stats?.longestStreak || 0}
                          </div>
                          <div className="text-sm text-gray-600">Best Streak</div>
                          <div className="text-xs text-gray-500 mt-1">Personal record</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {dashboardData?.stats?.level || 1}
                          </div>
                          <div className="text-sm text-gray-600">Level</div>
                          <div className="text-xs text-gray-500 mt-1">Progress tier</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-pink-600">
                            {Math.round(((dashboardData?.stats?.totalCheckIns || 0) / Math.max(1, Math.ceil((new Date() - new Date(dashboardData?.user?.joinDate || user?.profile?.joinDate)) / (1000 * 60 * 60 * 24)))) * 100) || 0}%
                          </div>
                          <div className="text-sm text-gray-600">Activity</div>
                          <div className="text-xs text-gray-500 mt-1">Daily average</div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="md:col-span-1">
                      <div className="flex flex-col gap-3 h-full justify-center">
                        <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Edit Profile
                        </button>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          View Achievements
                        </button>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Export Data
                        </button>
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                          Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Navigation Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🚀</span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      to="/mood-checkin"
                      className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span className="text-2xl mr-3">📝</span>
                      <span className="text-lg">Mood Check-In</span>
                    </Link>
                    <Link
                      to="/mood-history"
                      className="flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span className="text-2xl mr-3">📊</span>
                      <span className="text-lg">View History</span>
                    </Link>
                    <Link
                      to="/activities"
                      className="flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 px-5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span className="text-2xl mr-3">🎯</span>
                      <span className="text-lg">Activities</span>
                    </Link>
                  </div>
                </div>

                {/* Community Section - Enhanced */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🤝</span>
                    Community
                  </h3>
                  <p className="text-gray-700 mb-5 text-sm leading-relaxed">
                    Connect with others in our supportive community. Share your journey and get support.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => navigate('/community')}
                      className="flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
                    >
                      <span className="text-xl mr-3">💬</span>
                      <span>View Community</span>
                    </button>
                    <button
                      onClick={() => navigate('/community')}
                      className="flex items-center justify-center px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-base"
                    >
                      <span className="text-xl mr-3">✏️</span>
                      <span>Create Post</span>
                    </button>
                  </div>
                </div>

                {/* Mood Summary - Enhanced */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📈</span>
                    Mood Summary
                  </h3>
                  <MoodSummary 
                    stats={{
                      ...dashboardData?.stats,
                      moodDistribution: dashboardData?.trends?.distribution
                    }}
                    trends={dashboardData?.trends?.weekly || []}
                  />
                </div>

                {/* Activity Recommendations - Enhanced */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🎯</span>
                    Recommended for You
                  </h3>
                  <ActivityRecommendations />
                  <div className="mt-5">
                    <Link
                      to="/activities"
                      className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Browse All Activities
                    </Link>
                  </div>
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