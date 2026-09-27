import axios from 'axios';

// Resolve and normalize API and Backend URLs
// Automatically falls back to the production Render backend when deployed
const getProductionDefault = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://society-solve.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const rawUrl = (import.meta.env.VITE_API_URL || getProductionDefault()).trim();
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/+$/, '')}/api`;
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://') || assetPath.startsWith('blob:') || assetPath.startsWith('data:')) {
    return assetPath;
  }
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${BACKEND_URL}${cleanPath}`;
};

// Base API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear beginner error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to the SocietySolve server. Make sure the backend is running!';
    return Promise.reject(new Error(message));
  }
);

export default api;
