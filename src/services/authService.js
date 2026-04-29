import axiosClient from './axiosClient';

/**
 * Servicio encargado de gestionar la autenticación y la información de sesión de los usuarios.
 */
export const authService = {
  /**
   * Inicia sesión enviando las credenciales al servidor.
   * @param {Object} credentials - Objeto que contiene el email y password del usuario.
   * @returns {Promise<Object>} Promesa que resuelve en los datos de autenticación (token y usuario).
   */
  login: async (credentials) => {
    return await axiosClient.post('/auth/login', credentials);
  },

  getMe: async () => {
    return await axiosClient.get('/auth/me');
  }
};
