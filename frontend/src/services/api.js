import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL
    : window.VITE_API_BASE_URL,
});

// Este código será executado ANTES de CADA requisição ser enviada.
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      // Garante que o token mais recente esteja sempre no cabeçalho
      config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,

  // Se a resposta contiver um erro...
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Se o erro for 401 E não for uma tentativa de retry E não for na rota de refresh
    if (error.response.status === 401 && !originalRequest._retry && error.config.url !== '/auth/refresh') {
      originalRequest._retry = true; // Marca esta requisição para não tentar renovar de novo infinitamente

      try {
        console.log("Access token expirado. Tentando renovar...");
        // Tenta usar o refresh token para obter um novo access token
        await authStore.refreshAccessToken();
        
        // Se a renovação foi bem-sucedida, o novo token já está no header pelo interceptor de requisição.
        // Agora, tentamos a requisição original que falhou novamente.
        console.log("Token renovado. Repetindo a requisição original.");
        return api(originalRequest);

      } catch (refreshError) {
        // Se a renovação do token falhar, desloga o usuário.
        console.error("Refresh token inválido ou expirado. Deslogando usuário.");
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;