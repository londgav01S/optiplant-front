import { create } from 'zustand';
import { TOKEN_KEY } from '../utils/constants';
import axiosClient from '../services/axiosClient';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isLoading: false,

  login: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      // Endpoint para validar token y obtener usuario
      const userData = await axiosClient.get('/auth/me');
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
