import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injeta token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rappa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redireciona para login se token expirar
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const isAuthRoute = err.config.url?.includes('/auth/');
      if (!isAuthRoute) {
        localStorage.removeItem('rappa_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;