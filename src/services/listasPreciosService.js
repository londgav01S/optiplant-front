import axiosClient from './axiosClient';

/**
 * Servicio para consultar las listas de precios disponibles.
 */
export const listasPreciosService = {
  /**
   * Obtiene todas las listas de precios activas.
   * @returns {Promise<Array|Object>} Respuesta de la API con las listas de precios.
   */
  getAll: async () => {
    return await axiosClient.get('/listas-precios');
  }
};