import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { moodAPI, handleApiError } from '../utils/api';
import MoodList from '../components/common/MoodList';
import MoodCheckIn from '../components/forms/MoodCheckIn';

const MoodHistoryPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    averageMood: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch mood stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await moodAPI.getMoodStats();
        if (response.data.success) {
          setStats({
            totalEntries: response.data.data.totalEntries || 0,
            currentStreak: response.data.data.currentStreak || 0,
            averageMood: response.data.data.averageMood || 0
          });
        }
      } catch (error) {
        console.error('Error fetching mood stats:', error);
        const errorMessage = handleApiError(error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  // Handle edit
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingEntry(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingEntry(null);
  };

  // Handle delete success
  const handleDeleteSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/dashboard" 
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="text-xl mr-2">←</span>
              <span>Back to Dashboard</span>
            </Link>
            
            <Link 
              to="/mood-checkin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Entry
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Mood Journey
            </h1>
            <p className="text-gray-600">
              Track your emotional patterns and celebrate your progress
            </p>
          </div>
        </div>

        {/* Mood Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalEntries}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">😊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Average Mood</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : (stats.averageMood ? `${stats.averageMood.toFixed(1)}/5` : 'N/A')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Time Period</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              All Time
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors">
              This Week
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors">
              This Month
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors">
              Last 3 Months
            </button>
          </div>
        </div>

        {/* Mood History List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Mood History
            </h2>
            <div className="text-sm text-gray-500">
              Most recent first
            </div>
          </div>
          
          <MoodList 
            showActions={true}
            limit={20}
            onEdit={handleEdit}
            onDelete={handleDeleteSuccess}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Mood Insights
          </h3>
          <p className="text-gray-600 text-sm">
            Keep tracking your mood daily to discover patterns and improve your mental wellness. 
            Consider the factors that influence your mood and celebrate your progress!
          </p>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Mood Entry
                </h3>
                <button 
                  onClick={handleEditCancel}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
                             <MoodCheckIn 
                 existingEntry={editingEntry}
                 onSuccess={handleEditSuccess}
                 onCancel={handleEditCancel}
                 isModal={true}
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistoryPage; 