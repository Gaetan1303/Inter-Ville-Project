import axios from 'axios';

// Use dev proxy via Vite: frontend calls /api -> proxied to backend
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

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

export default API;
