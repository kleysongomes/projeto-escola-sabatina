<template>
  <header class="header">
    <h2 class="header-title">Review da Lição</h2>
    <button @click="handleLogout" class="btn-logout">Sair</button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

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
  padding: 1rem 1.5rem;
  background-color: var(--cor-container);
  border-bottom: 1px solid var(--cor-borda);
  z-index: 10;
}
.header-title {
  font-weight: 900;
  font-size: 1.2rem;
  color: var(--cor-texto);
}
.btn-logout {
  background: none;
  border: 1px solid var(--cor-borda);
  color: var(--cor-texto-suave);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}
</style>