import axiosClient from './axiosClient';

/**
 * Servicio para la gestión de "Proveedores" en el sistema.
 * Contiene los métodos para interactuar con los endpoints de proveedores de la API.
 */
export const proveedoresService = {
  /**
   * Obtiene la lista de todos los proveedores registrados.
   * @param {Object} params - Parámetros para paginación o filtros (ej. page, search).
   * @returns {Promise<Array>} Lista de proveedores.
   */
  getAll: async (params) => {
    return await axiosClient.get('/proveedores', { params });
  },
  
  /**
   * Obtiene los datos de un proveedor específico según su ID.
   * @param {number|string} id - Identificador del proveedor.
   * @returns {Promise<Object>} Datos del proveedor.
   */
  getById: async (id) => {
    return await axiosClient.get(`/proveedores/${id}`);
  },

  /**
   * Crea un nuevo proveedor en la base de datos.
   * @param {Object} data - Información del nuevo proveedor (nombre, contacto, etc.).
   * @returns {Promise<Object>} El proveedor recién creado.
   */
  create: async (data) => {
    return await axiosClient.post('/proveedores', data);
  },

  /**
   * Actualiza la información de un proveedor existente.
   * @param {Object} payload - Objeto con el id y los datos a actualizar.
   * @param {number|string} payload.id - ID del proveedor.
   * @param {Object} payload.data - Nuevos datos del proveedor.
   * @returns {Promise<Object>} El proveedor actualizado.
   */
  update: async ({ id, data }) => {
    return await axiosClient.put(`/proveedores/${id}`, data);
  },

  /**
   * Obtiene el historial de interacciones o compras relacionadas con un proveedor.
   * @param {number|string} id - Identificador del proveedor.
   * @param {Object} params - Parámetros adicionales (paginación, fechas).
   * @returns {Promise<Array>} Historial del proveedor.
   */
  getHistorial: async (id, params) => {
    return await axiosClient.get(`/proveedores/${id}/historial`, { params });
  }
};
