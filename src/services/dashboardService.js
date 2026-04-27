import axiosClient from './axiosClient';

/**
 * Servicio para consultar las métricas generales y estadísticas que alimentan el Dashboard.
 */
export const dashboardService = {
  /**
   * Obtiene las métricas clave (ventas, alertas, compras, estadísticas financieras, etc.).
   * @param {Object} params - Filtros opcionales (por ejemplo, rango de fechas).
   * @returns {Promise<Object>} Objeto con las diferentes métricas consolidadas.
   */
  getMetricas: async (params) => {
    return await axiosClient.get('/dashboard/metricas', { params });
  }
};
