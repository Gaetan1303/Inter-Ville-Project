import axios from 'axios';

// Use direct backend URL for Kubernetes/port-forward setup
const baseURL = 'http://localhost:5000';

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
