import axiosClient from './axiosClient';

/**
 * Servicio encargado de la gestión de las "Ventas".
 */
export const ventasService = {
  /**
   * Obtiene el listado general de ventas registradas.
   * @param {Object} params - Parámetros de consulta para paginación y filtros.
   * @returns {Promise<Array>} Listado de ventas.
   */
  getAll: async (params) => {
    return await axiosClient.get('/ventas', { params });
  },
  
  /**
   * Obtiene los detalles de una venta particular.
   * @param {number|string} id - Identificador de la venta.
   * @returns {Promise<Object>} Información detallada de la venta.
   */
  getById: async (id) => {
    return await axiosClient.get(`/ventas/${id}`);
  },

  /**
   * Crea una nueva venta en el sistema (registra productos, cliente y totales).
   * @param {Object} data - Datos de la venta a registrar.
   * @returns {Promise<Object>} La venta creada.
   */
  create: async (data) => {
    return await axiosClient.post('/ventas', data);
  },

  /**
   * Confirma una venta, lo que habitualmente desencadena el descuento de inventario.
   * @param {number|string} id - Identificador de la venta.
   * @returns {Promise<Object>} Resultado de la operación de confirmación.
   */
  confirmar: async (id) => {
    return await axiosClient.post(`/ventas/${id}/confirmar`);
  },

  /**
   * Anula o cancela una venta previamente registrada, revirtiendo el impacto en inventario si es necesario.
   * @param {number|string} id - Identificador de la venta a cancelar.
   * @returns {Promise<Object>} Resultado de la anulación.
   */
  cancelar: async (id) => {
    return await axiosClient.post(`/ventas/${id}/cancelar`);
  }
};
