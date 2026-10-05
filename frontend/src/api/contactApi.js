import api from './axios';

export const contactApi = {
  send: (data) => api.post('/contact', data),
};