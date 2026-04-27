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
    // BYPASS TEMPORAL PARA PRUEBAS SIN BACKEND
    if (credentials.email.includes('admin') || credentials.password === 'admin') {
      return {
        token: 'mock-jwt-token-temporal-12345',
        user: {
          id: 999,
          nombre: 'Administrador Temporal',
          email: credentials.email,
          rolNombre: 'ADMIN',
          sucursalId: null,
          sucursalNombre: 'Sede Central (Global)'
        }
      };
    }
    return await axiosClient.post('/auth/login', credentials);
  },
  
  /**
   * Obtiene la información del perfil del usuario actualmente autenticado.
   * Depende del token inyectado en las cabeceras por el axiosClient.
   * @returns {Promise<Object>} Promesa que resuelve en los detalles del usuario activo.
   */
  getMe: async () => {
    // BYPASS TEMPORAL PARA PRUEBAS SIN BACKEND
    const token = localStorage.getItem('inventario_token');
    if (token === 'mock-jwt-token-temporal-12345') {
      return {
        id: 999,
        nombre: 'Administrador Temporal',
        email: 'admin@optiplant.com',
        rolNombre: 'ADMIN',
        sucursalId: null,
        sucursalNombre: 'Sede Central (Global)'
      };
    }
    return await axiosClient.get('/auth/me');
  }
};
