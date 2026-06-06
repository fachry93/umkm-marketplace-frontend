import { api } from '../api/axiosInstance';

export const ProdukAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/produk', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/produk/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/produk', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id, data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.put(`/api/produk/${id}`, data, { headers });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/produk/${id}`);
    return response.data;
  }
};
