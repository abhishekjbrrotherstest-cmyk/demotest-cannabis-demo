import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.response ? `Request failed (${err.response.status})` : 'Network error — is the backend running?');
    err.userMessage = message;
    return Promise.reject(err);
  }
);

export default api;