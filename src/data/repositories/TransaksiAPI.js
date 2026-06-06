import { api } from '../api/axiosInstance';

export const TransaksiAPI = {
  getMine: async (page) => {
    const response = await api.get(page ? `/api/transaksi?page=${page}` : '/api/transaksi');
    return response.data;
  },
  getAll: async (page) => {
    const response = await api.get(page ? `/api/transaksi/all?page=${page}` : '/api/transaksi/all');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/transaksi/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/transaksi', data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/transaksi/${id}/status`, { status });
    return response.data;
  },
  getDetail: async (id) => {
    const response = await api.get(`/api/transaksi/${id}/detail`);
    return response.data;
  }
};
