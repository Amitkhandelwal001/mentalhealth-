import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <h1 className="text-xl font-bold text-gray-800">MindCare</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome back, {user?.profile?.displayName || user?.username}!
                  </span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-6xl sm:text-8xl">🌱</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Journey to
              <span className="text-primary-600 block">Mental Wellness</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A safe, supportive companion for tracking your mood, building healthy habits, 
              and connecting with a caring community. Start your path to better mental health today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg text-lg"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}
              </button>
              
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg"
                >
                  I Already Have an Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform supports you with tools designed by mental health experts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mood Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Daily check-ins to understand your emotional patterns and identify triggers. 
                  Visualize your progress with beautiful, easy-to-read charts.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🧘</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Activities</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered recommendations for breathing exercises, journaling prompts, 
                  mindfulness practices, and gentle physical activities.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Anonymous Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with a caring community in a safe, anonymous environment. 
                  Share experiences and receive support when you need it most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Better Mental Health
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your wellness journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', emoji: '✨', title: 'Sign Up', desc: 'Create your free account in seconds' },
              { step: '2', emoji: '📝', title: 'Daily Check-in', desc: 'Track your mood and thoughts' },
              { step: '3', emoji: '🎯', title: 'Get Recommendations', desc: 'Receive personalized activities' },
              { step: '4', emoji: '📈', title: 'Track Progress', desc: 'See your growth over time' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="text-4xl">💙</span>
          </div>
          <blockquote className="text-xl sm:text-2xl font-medium text-gray-900 mb-6 leading-relaxed">
            "MindCare has been a game-changer for my mental health journey. 
            The daily check-ins help me stay aware of my emotions, and the community support is incredible."
          </blockquote>
          <div className="text-gray-600">
            <p className="font-medium">Sarah M.</p>
            <p className="text-sm">College Student</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of people who are taking control of their mental health with MindCare.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg text-lg"
            >
              Get Started Free Today
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">🧠</span>
              <h3 className="text-xl font-bold">MindCare</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted companion for mental wellness and emotional growth.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-white transition-colors cursor-pointer">Support</span>
              <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
              <p>&copy; 2024 MindCare. Made with 💙 for better mental health.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 