import axios from 'axios';

const api = axios.create({
  // Lê a URL base do arquivo .env.local do Vite
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;