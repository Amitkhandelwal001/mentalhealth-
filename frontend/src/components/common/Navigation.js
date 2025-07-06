import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl">🧠</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">MindCare</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/mood-checkin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/mood-checkin')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Mood Check-In
            </Link>
            <Link
              to="/mood-history"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/mood-history')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              History
            </Link>
            <Link
              to="/activities"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/activities')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Activities
            </Link>
            <Link
              to="/community"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/community')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Community
            </Link>
            <Link
              to="/get-help"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/get-help')
                  ? 'bg-red-100 text-red-700'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              🆘 Get Help
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 text-sm">
                Welcome, {user?.username}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 