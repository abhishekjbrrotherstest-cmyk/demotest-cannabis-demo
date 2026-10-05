import api from './axios';

export const dutchieApi = {
  config: () => api.get('/dutchie/config'),
  menu: (storeId) => api.get(`/dutchie/menu/${storeId}`),
  menuByCategory: (storeId, category) => api.get(`/dutchie/menu/${storeId}/${category}`),
  product: (id) => api.get(`/dutchie/product/${id}`),
};

export const DUTCHIE_URL =
  import.meta.env.VITE_DUTCHIE_EMBED_URL ||
  'https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec';