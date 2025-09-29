import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RankingView from '../views/RankingView.vue';
import RegisterView from '../views/RegisterView.vue';
import AboutView from '../views/AboutView.vue';
import ReportBugView from '../views/ReportBugView.vue';
import ProfileView from '../views/ProfileView.vue';
import SettingsView from '../views/SettingsView.vue';
import UpdateProfileView from '../views/UpdateProfileView.vue';
import ChangePasswordView from '../views/ChangePasswordView.vue';
import DiscoverView from '../views/DiscoverView.vue';
// 1. IMPORTAR AS NOVAS VIEWS DE ADMIN
import AdminPromotionsView from '../views/AdminPromotionsView.vue';
import AdminPromotionFormView from '../views/AdminPromotionFormView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/register', name: 'register', component: RegisterView
    },
    {
      path: '/sobre', name: 'sobre', component: AboutView, meta: { requiresAuth: true }
    },
    {
      path: '/reportar-bug', name: 'report-bug', component: ReportBugView, meta: { requiresAuth: true }
    },
    {
      path: '/perfil', name: 'perfil', component: ProfileView, meta: { requiresAuth: true }
    },
    {
      path: '/configuracoes', name: 'configuracoes', component: SettingsView, meta: { requiresAuth: true }
    },
    {
      path: '/configuracoes/dados', name: 'update-profile', component: UpdateProfileView, meta: { requiresAuth: true }
    },
    {
      path: '/configuracoes/senha', name: 'change-password', component: ChangePasswordView, meta: { requiresAuth: true }
    },
    {
      path: '/descubra', name: 'descubra', component: DiscoverView, meta: { requiresAuth: true }
    },
    {
      path: '/admin/propagandas', name: 'admin-promotions', component: AdminPromotionsView, meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/propagandas/nova', name: 'admin-promotions-new', component: AdminPromotionFormView, meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/propagandas/editar/:id', name: 'admin-promotions-edit', component: AdminPromotionFormView, meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }
  
  if (to.meta.requiresAdmin && !authStore.user?.isAdmin) {
    console.warn('Tentativa de acesso não autorizado à rota de admin.');
    return next({ name: 'home' });
  }
  
  next();
});

export default router;