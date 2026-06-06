import { api } from '../api/axiosInstance';

export const QrisAPI = {
  getQris: async () => {
    const response = await api.get('/api/qris');
    return response.data;
  },
  uploadQris: async (formData) => {
    const response = await api.post('/api/qris', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
