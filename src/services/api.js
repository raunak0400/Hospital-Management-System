import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (data) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", data);
    return res.data; // { success: true, user: {...} }
  } catch (err) {
    return { success: false, error: err.response?.data?.message || err.message };
  }
};

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
};

export default api;
