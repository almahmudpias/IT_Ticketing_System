import axios from 'axios';

// This would be your Google Apps Script Web App URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nsu_ticket_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nsu_ticket_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;