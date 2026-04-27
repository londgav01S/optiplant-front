import axiosClient from './axiosClient';

export const inventarioService = {
  getAll: async (params) => {
    return await axiosClient.get('/inventario', { params });
  },
  
  ajustarStock: async (data) => {
    return await axiosClient.post('/inventario/ajuste', data);
  }
};
