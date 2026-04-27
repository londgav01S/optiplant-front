import axiosClient from './axiosClient';

export const dashboardService = {
  getMetricas: async (params) => {
    return await axiosClient.get('/dashboard/metricas', { params });
  }
};
