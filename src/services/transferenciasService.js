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
   * Registra el despacho real de una transferencia.
   * @param {number|string} id - Identificador de la transferencia.
   * @param {Object} data - Datos logísticos y líneas a despachar.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  despachar: async (id, data) => {
    return await axiosClient.post(`/transferencias/${id}/despachar`, data);
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
   * Registra la recepción de una transferencia con cantidades recibidas.
   * @param {number|string} id - Identificador de la transferencia.
   * @param {Object} data - Datos de recepción con líneas recibidas.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  recepcionar: async (id, data) => {
    return await axiosClient.post(`/transferencias/${id}/recepcionar`, data);
  },

  /**
   * Cancela una transferencia que aún no ha sido completada.
   * @param {number|string} id - Identificador de la transferencia.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  cancelar: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/cancelar`);
  },

  /**
   * Aprueba una transferencia pendiente.
   * @param {number|string} id - Identificador de la transferencia.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  aprobar: async (id) => {
    return await axiosClient.post(`/transferencias/${id}/aprobar`);
  },

  /**
   * Rechaza una transferencia con motivo especificado.
   * @param {Object} data - Contiene id de transferencia y motivo de rechazo.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  rechazar: async ({ id, motivo }) => {
    return await axiosClient.post(`/transferencias/${id}/rechazar`, { motivo });
  }
};
