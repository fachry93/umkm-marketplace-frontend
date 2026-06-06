import { api } from '../api/axiosInstance';

export const AuthAPI = {
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
  loginAdmin: async (data) => {
    const response = await api.post('/api/auth/admin/login', data);
    return response.data;
  }
};
