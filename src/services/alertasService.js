import axiosClient from './axiosClient';

export const alertasService = {
  getAlertas: async (params) => {
    return await axiosClient.get('/alertas', { params });
  },

  marcarLeida: async (id) => {
    return await axiosClient.patch(`/alertas/${id}/leida`);
  }
};
