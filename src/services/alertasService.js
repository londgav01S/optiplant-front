import axiosClient from './axiosClient';

/**
 * Servicio para el manejo de Alertas del sistema.
 */
export const alertasService = {
  /**
   * Obtiene la lista de alertas generadas en el sistema.
   * @param {Object} params - Parámetros de consulta (ej. estado de lectura, límite).
   * @returns {Promise<Array>} Lista de alertas.
   */
  getAlertas: async (params) => {
    return await axiosClient.get('/alertas', { params });
  },

  /**
   * Marca una alerta específica como leída para que deje de mostrarse como no leída o destacada.
   * @param {number|string} id - Identificador de la alerta.
   * @returns {Promise<Object>} Resultado de la actualización.
   */
  marcarLeida: async (id) => {
    return await axiosClient.patch(`/alertas/${id}/leida`);
  }
};
