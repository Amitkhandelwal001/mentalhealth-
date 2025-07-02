import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component - redirects to login if not authenticated
 * @param {React.Component} children - Child components to render if authenticated
 * @param {string} redirectTo - Path to redirect if not authenticated (default: '/login')
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location to redirect after login
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authentication is NOT required but user IS authenticated
  // (useful for login/register pages)
  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    const redirectPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if all conditions are met
  return children;
};

/**
 * PublicRoute component - redirects authenticated users to dashboard
 * Useful for login/register pages
 */
export const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  return (
    <ProtectedRoute requireAuth={false} redirectTo={redirectTo}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * AdminRoute component - requires authentication and admin privileges
 * (for future use when admin features are added)
 */
export const AdminRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check for admin privileges (when implemented)
  if (!user?.isAdmin && !hasPermission('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * ConditionalRoute component - renders different content based on auth status
 * Useful for components that need to show different content to authenticated/unauthenticated users
 */
export const ConditionalRoute = ({ 
  authenticatedComponent: AuthenticatedComponent,
  unauthenticatedComponent: UnauthenticatedComponent,
  loadingComponent: LoadingComponent,
  ...props 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return LoadingComponent ? (
      <LoadingComponent {...props} />
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedComponent {...props} />;
  }

  return <UnauthenticatedComponent {...props} />;
};

export default ProtectedRoute; 