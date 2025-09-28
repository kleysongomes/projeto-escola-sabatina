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
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;