import axiosClient from './axiosClient';

export const ventasService = {
  getAll: async (params) => {
    return await axiosClient.get('/ventas', { params });
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/ventas/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/ventas', data);
  },

  confirmar: async (id) => {
    return await axiosClient.post(`/ventas/${id}/confirmar`);
  },

  cancelar: async (id) => {
    return await axiosClient.post(`/ventas/${id}/cancelar`);
  }
};
