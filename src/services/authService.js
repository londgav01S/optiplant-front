import axiosClient from './axiosClient';

export const authService = {
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
