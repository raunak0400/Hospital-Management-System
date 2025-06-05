import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Step 1: Check if user is logged in (you can use localStorage for now)
  const token = localStorage.getItem('token'); // pretend login sets this

  // Step 2: If not logged in, send them to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Step 3: If logged in, show the page they wanted
  return children;
};

export default ProtectedRoute;
