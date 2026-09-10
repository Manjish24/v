import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 unauthorized to clear invalid sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear localStorage and redirect to login if not already on public route
      const isPublicPath = window.location.pathname.startsWith('/login') ||
                           window.location.pathname.startsWith('/signup') ||
                           window.location.pathname.startsWith('/verify') ||
                           window.location.pathname === '/';
      if (!isPublicPath) {
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
