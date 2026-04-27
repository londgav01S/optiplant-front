import axiosClient from './axiosClient';

export const usuariosService = {
  getAll: async (params) => {
    return await axiosClient.get('/usuarios', { params });
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/usuarios/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/usuarios', data);
  },

  update: async ({ id, data }) => {
    return await axiosClient.put(`/usuarios/${id}`, data);
  },

  changePassword: async ({ id, data }) => {
    return await axiosClient.patch(`/usuarios/${id}/password`, data);
  },

  toggleEstado: async (id) => {
    // Si el backend tiene un endpoint para desactivar/activar un usuario
    return await axiosClient.patch(`/usuarios/${id}/estado`);
  }
};
