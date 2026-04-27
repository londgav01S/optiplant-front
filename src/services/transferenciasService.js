import axiosClient from './axiosClient';

export const transferenciasService = {
  getAll: async (params) => {
    return await axiosClient.get('/transferencias', { params });
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/transferencias/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/transferencias', data);
  },

  enviar: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/enviar`);
  },

  recibir: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/recibir`);
  },

  cancelar: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/cancelar`);
  }
};
