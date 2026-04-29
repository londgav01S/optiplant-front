import axiosClient from './axiosClient';

/**
 * Servicio para la gestión de rutas y operaciones logísticas de envío.
 */
export const logisticaService = {
  /**
   * Obtiene todas las rutas de envío logístico registradas.
   * @param {Object} params - Parámetros de filtrado.
   * @returns {Promise<Array>} Listado de rutas de logística.
   */
  getAll: async (params) => {
    return await axiosClient.get('/logistica', { params });
  },

  /**
   * Obtiene las transferencias actualmente en tránsito.
   * @returns {Promise<Array>} Transferencias en tránsito.
   */
  getEnTransito: async () => {
    return await axiosClient.get('/logistica/en-transito');
  },

  /**
   * Crea una nueva ruta de envío logístico.
   * @param {Object} data - Datos y detalles de la nueva ruta.
   * @returns {Promise<Object>} La ruta creada.
   */
  createRuta: async (data) => {
    return await axiosClient.post('/logistica/rutas', data);
  },

  /**
   * Actualiza el estado de seguimiento de una ruta existente (ej. En tránsito, Completada, Cancelada).
   * @param {Object} payload - Objeto con el identificador de la ruta y su nuevo estado.
   * @param {number|string} payload.id - Identificador de la ruta.
   * @param {string} payload.estado - Nuevo estado de la ruta logística.
   * @returns {Promise<Object>} Resultado de la actualización.
   */
  updateEstado: async ({ id, estado }) => {
    return await axiosClient.patch(`/logistica/rutas/${id}/estado`, { estado });
  }
};
