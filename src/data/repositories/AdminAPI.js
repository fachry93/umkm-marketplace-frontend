import { api } from '../api/axiosInstance';

export const AdminAPI = {
  getProfile: async () => {
    const response = await api.get('/api/admins/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/api/admins/profile', data);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
};
