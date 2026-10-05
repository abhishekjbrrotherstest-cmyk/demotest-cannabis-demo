import api from './axios';

export const faqApi = {
  getFaqs: ({ category } = {}) => api.get('/faqs', { params: { category } }),
};