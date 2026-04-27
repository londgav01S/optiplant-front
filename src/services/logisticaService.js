import axiosClient from './axiosClient';

export const logisticaService = {
  getAll: async (params) => {
    return await axiosClient.get('/logistica', { params });
  },

  createRuta: async (data) => {
    return await axiosClient.post('/logistica/rutas', data);
  },

  updateEstado: async ({ id, estado }) => {
    return await axiosClient.patch(`/logistica/rutas/${id}/estado`, { estado });
  }
};
