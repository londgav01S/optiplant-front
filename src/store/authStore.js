import { create } from 'zustand';
import { TOKEN_KEY } from '../utils/constants';
import axiosClient from '../services/axiosClient';

/**
 * Store global de autenticación gestionado con Zustand.
 * Centraliza y mantiene el estado de la sesión del usuario para toda la aplicación.
 */
const useAuthStore = create((set) => ({
  // --- Estado Inicial ---
  /** @property {Object|null} user - Datos del perfil del usuario autenticado (nombre, rol, sucursal, etc.) */
  user: null,
  /** @property {string|null} token - Token JWT, inicializado desde localStorage si existe */
  token: localStorage.getItem(TOKEN_KEY) || null,
  /** @property {boolean} isAuthenticated - Bandera que indica si el usuario tiene una sesión activa */
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  /** @property {boolean} isLoading - Bandera para mostrar estados de carga mientras se valida la sesión */
  isLoading: false,

  // --- Acciones ---

  /**
   * Inicia la sesión en el store.
   * Guarda el token de forma persistente y actualiza el estado en memoria.
   * @param {string} token - Token de acceso devuelto por la API.
   * @param {Object} user - Datos del usuario autenticado.
   */
  login: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user, isAuthenticated: true });
  },

  /**
   * Cierra la sesión activa.
   * Limpia el almacenamiento, resetea el estado y fuerza la redirección a la pantalla de login.
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  /**
   * Verifica la validez del token guardado y recupera los datos del usuario.
   * Ideal para ejecutarse al cargar la aplicación (ej. en App.jsx) para restaurar la sesión.
   */
  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // Si no hay token guardado, el usuario no está autenticado
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      // Petición al backend para validar el token y obtener los detalles del usuario actual
      const userData = await axiosClient.get('/auth/me');
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Si la petición falla (ej. token expirado), se limpia la sesión local para evitar estados inconsistentes
      localStorage.removeItem(TOKEN_KEY);
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
