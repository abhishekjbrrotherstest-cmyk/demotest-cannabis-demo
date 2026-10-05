import api from './axios';

export const homeApi = {
  getBanners: () => api.get('/home/banners'),
  getSections: () => api.get('/home/sections'),
};

export const aboutApi = {
  getSections: () => api.get('/about/sections'),
};

export const pageApi = {
  list: () => api.get('/pages'),
  getBySlug: (slug) => api.get(`/pages/${slug}`),
};

export const searchApi = {
  search: (q) => api.get('/search', { params: { q } }),
};

export const menuApi = {
  getMenus: () => api.get('/menus'),
};

export const storeApiExtra = {
  getEvents: (id) => api.get(`/stores/${id}/events`),
};