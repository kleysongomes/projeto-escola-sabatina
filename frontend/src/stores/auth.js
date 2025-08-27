import { defineStore } from 'pinia';
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

        // Guardamos o token no estado e no localStorage
        this.token = token;
        localStorage.setItem('token', token);

        // Adicionamos o token aos cabeçalhos do axios para futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Podemos futuramente buscar os dados do usuário e guardar aqui também
        // this.user = ...

        return true; // Sucesso
      } catch (error) {
        this.logout(); // Limpa qualquer estado antigo em caso de erro
        throw error; // Propaga o erro para o componente tratar
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    },
  },
});