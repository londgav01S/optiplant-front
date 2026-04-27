import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

/**
 * Cliente HTTP configurado basado en Axios.
 * Se utiliza como la instancia central para realizar todas las peticiones a la API del backend.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de solicitudes (Requests).
 * Se ejecuta antes de que la petición sea enviada al servidor.
 * Su propósito principal es inyectar el token de autenticación (JWT) en las cabeceras de autorización.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas (Responses).
 * Se ejecuta cuando el servidor responde, antes de que la respuesta sea procesada por el frontend.
 * Útil para desenvolver datos y manejar errores globales como la expiración de la sesión.
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Si el backend envuelve la respuesta en un objeto con propiedad 'data', la extraemos directamente
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Manejo global de errores de autenticación (Ej: Token expirado o inválido)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Redirigimos al login si el usuario es rechazado por el backend y no está ya en la página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
