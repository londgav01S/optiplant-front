import axiosClient from './axiosClient';

/**
 * Servicio para administrar las diferentes "Sucursales", oficinas o bodegas de la empresa.
 */
export const sucursalesService = {
  /**
   * Obtiene una lista con todas las sucursales del sistema.
   * @returns {Promise<Array>} Listado general de sucursales.
   */
  getAll: async () => {
    return await axiosClient.get('/sucursales');
  },
  
  /**
   * Obtiene la información específica y completa de una sucursal por su ID.
   * @param {number|string} id - Identificador de la sucursal.
   * @returns {Promise<Object>} Datos de la sucursal.
   */
  getById: async (id) => {
    return await axiosClient.get(`/sucursales/${id}`);
  },

  /**
   * Crea un registro para una nueva sucursal en el sistema.
   * @param {Object} data - Información de configuración de la sucursal.
   * @returns {Promise<Object>} La sucursal recién creada.
   */
  create: async (data) => {
    return await axiosClient.post('/sucursales', data);
  },

  /**
   * Actualiza la información (nombre, ubicación, etc.) de una sucursal existente.
   * @param {Object} payload - Objeto con id y datos actualizados.
   * @returns {Promise<Object>} La sucursal actualizada.
   */
  update: async ({ id, data }) => {
    return await axiosClient.put(`/sucursales/${id}`, data);
  },

  /**
   * Desactiva de manera lógica una sucursal en el sistema.
   * @param {number|string} id - Identificador de la sucursal a desactivar.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  desactivar: async (id) => {
    return await axiosClient.patch(`/sucursales/${id}/desactivar`);
  }
};
