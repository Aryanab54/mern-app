import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Agent API
export const agentAPI = {
  create: (agentData) => api.post('/agents', agentData),
  getAll: () => api.get('/agents'),
};

// List API
export const listAPI = {
  upload: (formData) => api.post('/leads/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDistributed: () => api.get('/leads/distribution'),
  getAgentLeads: (agentId) => api.get(`/leads/agent/${agentId}`),
};

// Assignment API
export const assignmentAPI = {
  getAll: () => api.get('/assignments'),
  getByAgent: (agentId) => api.get(`/assignments/agent/${agentId}`),
  getStats: () => api.get('/assignments/stats'),
};

export default api;