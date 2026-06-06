import { api } from '../api/axiosInstance';

export const NewsAPI = {
  getAll: async (page) => {
    const response = await api.get(`/api/news?page=${page || 1}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/news/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/news', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/news/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/news/${id}`);
    return response.data;
  }
};
