import axiosClient from './axiosClient';

export const proveedoresService = {
  getAll: async (params) => {
    return await axiosClient.get('/proveedores', { params });
  },
  
  getById: async (id) => {
    return await axiosClient.get(`/proveedores/${id}`);
  },

  create: async (data) => {
    return await axiosClient.post('/proveedores', data);
  },

  update: async ({ id, data }) => {
    return await axiosClient.put(`/proveedores/${id}`, data);
  },

  getHistorial: async (id, params) => {
    return await axiosClient.get(`/proveedores/${id}/historial`, { params });
  }
};
