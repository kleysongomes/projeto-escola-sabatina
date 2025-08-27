import axios from 'axios';

const api = axios.create({
  // Lê a variável global que foi injetada pelo Nginx no index.html
  baseURL: window.VITE_API_BASE_URL,
});

export default api;