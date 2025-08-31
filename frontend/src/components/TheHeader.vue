<template>
  <header class="header">
    <div class="left-actions">
      <RouterLink to="/sobre" class="header-btn" aria-label="Sobre o projeto">
        <HelpCircle :size="22" />
      </RouterLink>
    </div>

    <img :src="logoUrl" alt="Stud+ Logo" class="header-logo" />

    <div class="right-actions">
      <button @click="handleLogout" class="header-btn" aria-label="Sair">
        <LogOut :size="20" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { LogOut, HelpCircle } from 'lucide-vue-next';
import logoUrl from '@/assets/stud_blue.png';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: var(--cor-container);
  border-bottom: 1px solid var(--cor-borda);
  z-index: 10;
  height: 60px;
}
.left-actions, .right-actions {
  flex: 1;
}
.right-actions {
  display: flex;
  justify-content: flex-end;
}

.header-logo {
  height: 80px; /* Ajuste esta altura conforme o design da sua logo */
}

.header-btn {
  background: none;
  border: none;
  color: var(--cor-texto-suave);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: background-color 0.2s, color 0.2s;
}
.header-btn:hover {
  background-color: #f0f0f0;
  color: var(--cor-texto);
}
</style>