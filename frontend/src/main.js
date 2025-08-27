import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import api from './services/api' // Importamos nosso serviço de api

const app = createApp(App)

app.use(createPinia())

// --- NOVA LÓGICA DE INICIALIZAÇÃO ---
// Antes de o Vue Router ser configurado, verificamos o login.
const authStore = useAuthStore();
if (authStore.isAuthenticated) {
  api.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
}
// --- FIM DA NOVA LÓGICA ---

app.use(router)

app.mount('#app')