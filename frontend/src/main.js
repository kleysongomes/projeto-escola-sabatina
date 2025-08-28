import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification"; // <-- 1. IMPORTAR
import "vue-toastification/dist/index.css"; // <-- 2. IMPORTAR O CSS

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import api from './services/api'

const app = createApp(App)

app.use(createPinia())

// --- Configuração de inicialização (código existente) ---
const authStore = useAuthStore();
// ...

// --- 3. CONFIGURAR O PLUGIN DE TOAST ---
const toastOptions = {
  position: "top-right",
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
};
app.use(Toast, toastOptions);
// --- FIM DA CONFIGURAÇÃO ---

app.use(router)
app.mount('#app')