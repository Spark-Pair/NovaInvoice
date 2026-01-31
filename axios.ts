import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + 'api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token + usingEntity automatically
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    const entity = localStorage.getItem('usingEntity');

    // Attach auth token
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }

    // Attach entity (admin acting as client)
    if (entity) {
      const parsedEntity = JSON.parse(entity);

      // safest: send only ID
      if (parsedEntity?.id) {
        config.headers['X-Entity-Id'] = parsedEntity.id;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('usingEntity');

      // hard redirect (clears state)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
