import axiosClient from './axiosClient';

export const productosService = {
  getAll: async (params) => {
    return await axiosClient.get('/productos', { params });
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/productos/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/productos', data);
  },

  update: async ({ id, data }) => {
    return await axiosClient.put(`/productos/${id}`, data);
  },

  desactivar: async (id) => {
    return await axiosClient.patch(`/productos/${id}/desactivar`);
  }
};
