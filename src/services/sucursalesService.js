import axiosClient from './axiosClient';

export const sucursalesService = {
  getAll: async () => {
    return await axiosClient.get('/sucursales');
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/sucursales/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/sucursales', data);
  },

  update: async ({ id, data }) => {
    return await axiosClient.put(`/sucursales/${id}`, data);
  },

  desactivar: async (id) => {
    return await axiosClient.patch(`/sucursales/${id}/desactivar`);
  }
};
