import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Pages
import Login from './pages/Login';
import Register from "./pages/Register"; // adjust the path if needed
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import PatientDetail from './pages/PatientDetail';
import NotFound from './pages/NotFound';

// Protected Route wrapper
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Register />} /> {/* Add this line to make Register the default */}


        {/* Protected Routes with Layout */}
        <Route
          path="/dashboard" // Changed path to /dashboard
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Layout>
                <Patients />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute>
              <Layout>
                <AddPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-patient/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;