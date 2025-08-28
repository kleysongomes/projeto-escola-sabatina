import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import api from './services/api'

const app = createApp(App)

app.use(createPinia())

const authStore = useAuthStore();
if (authStore.isAuthenticated) {
  api.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
}

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

app.use(router)

app.mount('#app')