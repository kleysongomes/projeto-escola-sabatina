import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL // Em DEV, usa a variável do arquivo .env.local
  : window.VITE_API_BASE_URL;        // Em PROD, usa a variável injetada pelo Nginx

const api = axios.create({
  baseURL: baseURL,
});

export default api;