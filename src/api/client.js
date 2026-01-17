import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (data) => api.post('/api/employees', data),
  delete: (id) => api.delete(`/api/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/api/attendance', { params }),
  getByEmployee: (employeeId) => api.get(`/api/attendance/${employeeId}`),
  getSummary: (employeeId) => api.get(`/api/attendance/${employeeId}/summary`),
  create: (data) => api.post('/api/attendance', data),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/api/dashboard/summary'),
};

export default api;
