import api from './axios';

export const careerApi = {
  getCareers: () => api.get('/careers'),
  getCareer: (id) => api.get(`/careers/${id}`),
  apply: (id, data) => api.post(`/careers/${id}/apply`, data),
};