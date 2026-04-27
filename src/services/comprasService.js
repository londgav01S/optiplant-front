import axiosClient from './axiosClient';

/**
 * Servicio para gestionar las "Órdenes de Compra" a proveedores.
 */
export const comprasService = {
  /**
   * Lista todas las compras registradas en el sistema.
   * @param {Object} params - Opciones de filtrado y paginación.
   * @returns {Promise<Array>} Listado de órdenes de compra.
   */
  getAll: async (params) => {
    return await axiosClient.get('/compras', { params });
  },
  
  /**
   * Obtiene el detalle de una compra específica.
   * @param {number|string} id - Identificador de la compra.
   * @returns {Promise<Object>} Datos detallados de la orden de compra.
   */
  getById: async (id) => {
    return await axiosClient.get(`/compras/${id}`);
  },

  /**
   * Crea una nueva orden de compra.
   * @param {Object} data - Información de la compra, incluyendo productos y proveedor.
   * @returns {Promise<Object>} La orden de compra creada.
   */
  create: async (data) => {
    return await axiosClient.post('/compras', data);
  },

  /**
   * Marca una orden de compra como "recibida", lo cual debe actualizar el inventario.
   * @param {number|string} id - Identificador de la orden de compra.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  recibir: async (id) => {
    return await axiosClient.post(`/compras/${id}/recibir`);
  },

  /**
   * Cancela una orden de compra en caso de error o anulación del pedido.
   * @param {number|string} id - Identificador de la orden de compra.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  cancelar: async (id) => {
    return await axiosClient.post(`/compras/${id}/cancelar`);
  }
};
