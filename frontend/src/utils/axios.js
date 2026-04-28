import axios from 'axios';
import { API_URL } from '../config/api';
import { readStorage, removeStorage } from './storage';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = readStorage('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBrowser = typeof window !== 'undefined';
    const requestUrl = error.config?.url || '';
    const isPublicAuthRequest = /\/auth\/(login|register|forgot-password)$/.test(requestUrl);

    if (error.response?.status === 401 && isBrowser && !isPublicAuthRequest) {
      removeStorage('token', 'user');
      const isAdminPath = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPath ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
