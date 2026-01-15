import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // backend URL
  baseURL: import.meta.env.VITE_BACKEND_URL+"api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');

      // hard redirect (clears state)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
