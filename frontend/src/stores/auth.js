import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {

  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {

    async login(usuario, senha) {
      try {
        const response = await api.post('/usuarios/login', { usuario, senha });
        const { accessToken, refreshToken } = response.data;
        
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        localStorage.removeItem('cachedLesson');

        const userData = jwtDecode(accessToken);
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        
        return true;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    
    async logout() {
      if (this.accessToken) {
        try {
          await api.post('/usuarios/logout');
        } catch (error) {
          console.error("Erro ao fazer logout no servidor:", error);
        }
      }
      
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cachedLesson');
    },

    async refreshAccessToken() {
      try {
        const response = await api.post('/auth/refresh', {
          refreshToken: this.refreshToken,
        });
        const { accessToken } = response.data;

        this.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        
        const userData = jwtDecode(accessToken);
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));

        return accessToken;
      } catch (error) {
        console.error("Não foi possível renovar o token:", error);
        // Se o refresh falhar, o interceptor irá deslogar o usuário.
        throw error;
      }
    },
  },
});