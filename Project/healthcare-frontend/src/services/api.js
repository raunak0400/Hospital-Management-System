import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Patient API
export const patientAPI = {
  // Get all patients with search and pagination
  getPatients: (params = {}) => {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
    return api.get('/patients', {
      params: { page, limit, search, sortBy, sortOrder }
    });
  },

  // Get single patient
  getPatient: (id) => api.get(`/patients/${id}`),

  // Create new patient
  createPatient: (patientData) => api.post('/patients', patientData),

  // Update patient
  updatePatient: (id, patientData) => api.put(`/patients/${id}`, patientData),

  // Delete patient
  deletePatient: (id) => api.delete(`/patients/${id}`),

  // Advanced search
  advancedSearch: (searchCriteria) => api.post('/search/advanced', searchCriteria),

  // Get patient documents
  getPatientDocuments: (patientId) => api.get(`/patients/${patientId}/documents`),
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: () => api.get('/analytics/dashboard'),

  // Get gender distribution
  getGenderDistribution: () => api.get('/analytics/gender'),

  // Get age distribution
  getAgeDistribution: () => api.get('/analytics/age'),

  // Get disease distribution
  getDiseaseDistribution: () => api.get('/analytics/diseases'),

  // Get patients over time
  getPatientsOverTime: () => api.get('/analytics/patients-over-time'),

  // Get revenue analytics
  getRevenueAnalytics: () => api.get('/analytics/revenue'),

  // Get doctor performance
  getDoctorPerformance: () => api.get('/analytics/doctor-performance'),

  // Get patient satisfaction
  getPatientSatisfaction: () => api.get('/analytics/patient-satisfaction'),
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getNotifications: () => api.get('/notifications'),

  // Mark notification as read
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
};

// File Upload API
export const uploadAPI = {
  // Upload patient document
  uploadPatientDocument: (patientId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);
    
    return api.post('/upload/patient-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Admin API
export const adminAPI = {
  // Get all users
  getUsers: () => api.get('/admin/users'),

  // Get audit logs
  getAuditLogs: (params = {}) => {
    const { page = 1, limit = 50, action = '' } = params;
    return api.get('/admin/audit-logs', {
      params: { page, limit, action }
    });
  },

  // Get system stats
  getSystemStats: () => api.get('/admin/system-stats'),

  // Create backup
  createBackup: () => api.post('/admin/backup'),

  // Run maintenance
  runMaintenance: () => api.post('/admin/maintenance'),
};

// Export API
export const exportAPI = {
  // Export patients to CSV
  exportPatients: () => api.get('/export/patients', {
    responseType: 'blob'
  }),
};

// Health Check API
export const healthAPI = {
  // Get system health
  getHealth: () => api.get('/health'),
};

export default api;
