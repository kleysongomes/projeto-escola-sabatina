import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RankingView from '../views/RankingView.vue';
import AllReviewsView from '../views/AllReviewsView.vue';
import RegisterView from '../views/RegisterView.vue'; // <-- IMPORTAR

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... (rotas '/', '/login', '/ranking', '/reviews' existentes)
    {
      path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true }
    },
    {
      path: '/login', name: 'login', component: LoginView
    },
    {
      path: '/ranking', name: 'ranking', component: RankingView, meta: { requiresAuth: true }
    },
    {
      path: '/reviews', name: 'reviews', component: AllReviewsView, meta: { requiresAuth: true }
    },
    { 
      path: '/register', name: 'register', component: RegisterView
    }
  ]
});

// ... (código do router.beforeEach continua igual) ...
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;