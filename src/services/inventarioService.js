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
   * Obtiene el inventario completo de una sucursal específica.
   * @param {number|string} sucursalId - ID de la sucursal.
   * @returns {Promise<Array>} Inventario de la sucursal.
   */
  getBySucursal: async (sucursalId) => {
    return await axiosClient.get(`/inventario/sucursal/${sucursalId}`);
  },
  
  /**
   * Realiza un ajuste manual de stock (entradas o salidas no asociadas a procesos de compra o venta).
   * @param {Object} data - Datos del ajuste (producto involucrado, cantidad a ajustar, motivo).
   * @returns {Promise<Object>} Resultado del ajuste de inventario.
   */
  ajustarStock: async (data) => {
    return await axiosClient.post('/inventario/ajuste', data);
  },

  /**
   * Actualiza la configuración de stock (niveles mínimo y máximo) para un inventario específico.
   * @param {number} id - ID del inventario
   * @param {Object} config - Objeto con stockMinimo y stockMaximo
   * @returns {Promise<Object>} Inventario actualizado
   */
  actualizarConfig: async (id, config) => {
    return await axiosClient.put(`/inventarios/${id}/config`, config);
  }
};
