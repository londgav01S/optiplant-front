import axiosClient from './axiosClient';

/**
 * Servicio para gestionar las "Transferencias" de inventario (movimiento entre distintas sucursales o bodegas).
 */
export const transferenciasService = {
  /**
   * Obtiene el listado de transferencias registradas.
   * @param {Object} params - Parámetros de consulta y filtrado.
   * @returns {Promise<Array>} Listado de transferencias.
   */
  getAll: async (params) => {
    return await axiosClient.get('/transferencias', { params });
  },
  
  /**
   * Obtiene el detalle de una transferencia específica.
   * @param {number|string} id - ID de la transferencia.
   * @returns {Promise<Object>} Datos completos de la transferencia.
   */
  getById: async (id) => {
    return await axiosClient.get(`/transferencias/${id}`);
  },

  /**
   * Crea una nueva solicitud de transferencia de inventario.
   * @param {Object} data - Información de los productos y ubicaciones (origen y destino) involucradas.
   * @returns {Promise<Object>} Transferencia creada.
   */
  create: async (data) => {
    return await axiosClient.post('/transferencias', data);
  },

  /**
   * Marca una transferencia como "enviada" (en tránsito hacia la sucursal de destino).
   * @param {number|string} id - Identificador de la transferencia.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  enviar: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/enviar`);
  },

  /**
   * Marca una transferencia como "recibida" en la sucursal de destino, completando el movimiento de stock.
   * @param {number|string} id - Identificador de la transferencia.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  recibir: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/recibir`);
  },

  /**
   * Cancela una transferencia que aún no ha sido completada.
   * @param {number|string} id - Identificador de la transferencia.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  cancelar: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/cancelar`);
  }
};
