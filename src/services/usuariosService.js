import axiosClient from './axiosClient';

/**
 * Servicio de administración de "Usuarios" del sistema (empleados, administradores, operadores).
 */
export const usuariosService = {
  /**
   * Lista todos los usuarios registrados en la plataforma.
   * @param {Object} params - Filtros, términos de búsqueda y paginación.
   * @returns {Promise<Array>} Listado de usuarios.
   */
  getAll: async (params) => {
    return await axiosClient.get('/usuarios', { params });
  },
  
  /**
   * Obtiene los detalles de un usuario en particular.
   * @param {number|string} id - ID del usuario.
   * @returns {Promise<Object>} Datos del perfil del usuario.
   */
  getById: async (id) => {
    return await axiosClient.get(`/usuarios/${id}`);
  },

  /**
   * Crea un nuevo usuario en la plataforma.
   * @param {Object} data - Datos personales, rol y credenciales del usuario.
   * @returns {Promise<Object>} El usuario creado exitosamente.
   */
  create: async (data) => {
    return await axiosClient.post('/usuarios', data);
  },

  /**
   * Actualiza la información del perfil o los permisos de un usuario existente.
   * @param {Object} payload - Contiene el identificador y los datos a actualizar.
   * @returns {Promise<Object>} El usuario modificado.
   */
  update: async ({ id, data }) => {
    return await axiosClient.put(`/usuarios/${id}`, data);
  },

  /**
   * Cambia o restablece la contraseña de un usuario determinado.
   * @param {Object} payload - Objeto con el id del usuario y las nuevas credenciales (contraseña).
   * @returns {Promise<Object>} Resultado del cambio de contraseña.
   */
  changePassword: async ({ id, data }) => {
    return await axiosClient.patch(`/usuarios/${id}/password`, data);
  },

  /**
   * Alterna el estado (Activo/Inactivo) de un usuario en el sistema.
   * Generalmente usado para dar de baja el acceso de un empleado sin eliminar su historial.
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  toggleEstado: async (id) => {
    return await axiosClient.patch(`/usuarios/${id}/estado`);
  }
};
