import axios from 'axios';

// Use environment variable or fallback to development URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Inject Authorization header from localStorage if present
try {
  const storedToken = localStorage.getItem('accessToken');
  if (storedToken) {
    API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
} catch (_) {}

// Ensure Authorization header is attached on every request
API.interceptors.request.use(
  (config) => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
