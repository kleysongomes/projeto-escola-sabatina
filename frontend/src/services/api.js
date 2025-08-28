import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL
    : window.VITE_API_BASE_URL,
});

// Este código será executado para CADA resposta que a API nos der.
api.interceptors.response.use(
  // Se a resposta for bem-sucedida, apenas a repassamos.
  (response) => response,

  // Se a resposta contiver um erro...
  (error) => {
    // Verificamos se o erro é o "401 Unauthorized" (token inválido/expirado).
    if (error.response && error.response.status === 401) {
      // Usamos o nosso authStore para limpar os dados do usuário.
      const authStore = useAuthStore();
      authStore.logout();

      // Forçamos o redirecionamento para a página de login.
      // Usar window.location.href garante que todo o estado da aplicação seja limpo.
      window.location.href = '/login';
    }

    // Se for qualquer outro erro, apenas o rejeitamos para que o
    // componente que fez a chamada possa tratá-lo (ex: mostrar um toast).
    return Promise.reject(error);
  }
);

export default api;