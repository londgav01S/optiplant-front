import axiosClient from './axiosClient';

/**
 * Servicio encargado de las consultas y manipulaciones directas sobre el stock o inventario.
 */
export const inventarioService = {
  /**
   * Obtiene el listado actual del inventario, permitiendo filtrar por sucursal o producto.
   * @param {Object} params - Parámetros de filtrado.
   * @returns {Promise<Array>} Listado del inventario.
   */
  getAll: async (params) => {
    return await axiosClient.get('/inventario', { params });
  },
  
  /**
   * Realiza un ajuste manual de stock (entradas o salidas no asociadas a procesos de compra o venta).
   * @param {Object} data - Datos del ajuste (producto involucrado, cantidad a ajustar, motivo).
   * @returns {Promise<Object>} Resultado del ajuste de inventario.
   */
  ajustarStock: async (data) => {
    return await axiosClient.post('/inventario/ajuste', data);
  }
};
