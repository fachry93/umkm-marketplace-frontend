import { api } from '../api/axiosInstance';

export const NotifikasiAPI = {
  getAll: async () => {
    const response = await api.get('/api/notifikasi');
    return response.data;
  },
  markRead: async (id) => {
    const response = await api.put(`/api/notifikasi/${id}/baca`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await api.put('/api/notifikasi/baca-semua');
    return response.data;
  },
  send: async (data) => {
    const response = await api.post('/api/notifikasi', data);
    return response.data;
  }
};
