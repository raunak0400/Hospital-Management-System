import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Provider
import { AuthProvider } from './utils/auth';

// Pages
import Login from './pages/Login';
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import PatientDetail from './pages/PatientDetail';
import NotFound from './pages/NotFound';
import TestInput from './pages/TestInput';
import AddPatientStandalone from './pages/AddPatientStandalone';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Register />} />
            <Route path="/test-input" element={<TestInput />} />
            <Route path="/add-patient-standalone" element={<AddPatientStandalone />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/dashboard"
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
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;