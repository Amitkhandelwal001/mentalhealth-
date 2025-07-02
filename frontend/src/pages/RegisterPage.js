import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { PublicRoute } from '../components/common/ProtectedRoute';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (data) => {
    // Navigate to dashboard after successful registration
    navigate('/dashboard');
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* App Logo/Branding */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MindCare
            </h1>
            <p className="text-gray-600">
              Your mental wellness companion
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </div>
    </PublicRoute>
  );
};

export default RegisterPage; 