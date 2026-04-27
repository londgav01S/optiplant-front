import axiosClient from './axiosClient';

export const comprasService = {
  getAll: async (params) => {
    return await axiosClient.get('/compras', { params });
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/compras/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/compras', data);
  },

  recibir: async (id) => {
    return await axiosClient.post(`/compras/${id}/recibir`);
  },

  cancelar: async (id) => {
    return await axiosClient.post(`/compras/${id}/cancelar`);
  }
};
