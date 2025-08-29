import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(usuario, senha) {
      try {
        const response = await api.post('/usuarios/login', { usuario, senha });
        const token = response.data.token;
        
        this.token = token;
        localStorage.setItem('token', token);

        localStorage.removeItem('cachedLesson');

        const userData = jwtDecode(token);
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cachedLesson');
      delete api.defaults.headers.common['Authorization'];
    },
  },
});