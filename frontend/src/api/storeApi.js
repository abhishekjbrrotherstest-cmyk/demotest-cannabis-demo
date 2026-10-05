import api from './axios';

export const storeApi = {
  getStores: () => api.get('/stores'),
  getStore: (idOrSlug) => api.get(`/stores/${idOrSlug}`),
  getHours: (id) => api.get(`/stores/${id}/hours`),
  getEvents: (id) => api.get(`/stores/${id}/events`),
};