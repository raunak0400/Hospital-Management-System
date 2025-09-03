import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import Loader from './Loader';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;
