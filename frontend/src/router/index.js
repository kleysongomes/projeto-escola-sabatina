import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RankingView from '../views/RankingView.vue';
import AllReviewsView from '../views/AllReviewsView.vue';
import RegisterView from '../views/RegisterView.vue';
import AboutView from '../views/AboutView.vue';
import ReportBugView from '../views/ReportBugView.vue';
import ProfileView from '../views/ProfileView.vue';
import SettingsView from '../views/SettingsView.vue';
import UpdateProfileView from '../views/UpdateProfileView.vue';
import ChangePasswordView from '../views/ChangePasswordView.vue';
import AcceptPolicyView from '../views/AcceptPolicyView.vue';

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
      path: '/reviews', name: 'reviews', component: AllReviewsView, meta: { requiresAuth: true }
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
      path: '/aceitar-politica', name: 'accept-policy', component: AcceptPolicyView, meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const safeRoutes = ['login', 'register', 'accept-policy'];

  if (authStore.isAuthenticated && authStore.user && !authStore.user.politicaAceita && !safeRoutes.includes(to.name)) {
    return next({ name: 'accept-policy', query: { force: 'true' } });
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }
  
  next();
});

export default router;