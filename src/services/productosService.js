import axiosClient from './axiosClient';

/**
 * Servicio para gestionar la entidad "Productos" en el sistema.
 * Agrupa todas las llamadas a la API relacionadas con la gestión del catálogo de productos.
 */
export const productosService = {
  /**
   * Obtiene una lista de todos los productos, soportando filtrado y paginación a través de los parámetros.
   * @param {Object} params - Objeto de parámetros de consulta (ej. page, limit, search).
   * @returns {Promise<Array|Object>} Respuesta de la API con los productos encontrados.
   */
  getAll: async (params) => {
    return await axiosClient.get('/productos', { params });
  },
  
  /**
   * Obtiene los detalles completos de un producto específico mediante su ID.
   * @param {number|string} id - El identificador único del producto.
   * @returns {Promise<Object>} Datos detallados del producto.
   */
  getById: async (id) => {
    return await axiosClient.get(`/productos/${id}`);
  },

  /**
   * Crea un nuevo registro de producto en el sistema.
   * @param {Object} data - Información o payload del nuevo producto.
   * @returns {Promise<Object>} Confirmación de creación y datos del nuevo producto.
   */
  create: async (data) => {
    return await axiosClient.post('/productos', data);
  },

  /**
   * Actualiza la información de un producto ya existente.
   * @param {Object} payload - Contiene el identificador y la nueva información.
   * @param {number|string} payload.id - ID del producto a modificar.
   * @param {Object} payload.data - Datos actualizados a enviar al servidor.
   * @returns {Promise<Object>} El producto actualizado.
   */
  update: async ({ id, data }) => {
    return await axiosClient.put(`/productos/${id}`, data);
  },

  /**
   * Desactiva (o da de baja de forma lógica) a un producto.
   * Evita que el producto se pueda usar en nuevas ventas, compras o transferencias.
   * @param {number|string} id - Identificador del producto a desactivar.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  desactivar: async (id) => {
    return await axiosClient.patch(`/productos/${id}/desactivar`);
  }
};
