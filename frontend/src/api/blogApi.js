import api from './axios';

export const blogApi = {
  getPosts: (params) => api.get('/blog', { params }),
  getPost: (slug) => api.get(`/blog/${slug}`),
};