import { api } from '../api/axiosInstance';

export const UmkmAPI = {
  getAll: async (page) => {
    const response = await api.get(page ? `/api/umkm?page=${page}` : '/api/umkm');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/umkm/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/umkm', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id, data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.put(`/api/umkm/${id}`, data, { headers });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/umkm/${id}`);
    return response.data;
  }
};
