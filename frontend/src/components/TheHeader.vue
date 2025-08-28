<template>
  <header class="header">
    <h2 class="header-title">Check in Lição</h2>
    <button @click="handleLogout" class="btn-logout" aria-label="Sair">
      <LogOut :size="20" />
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { LogOut } from 'lucide-vue-next'; // Import do ícone

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
  border-radius: 8px;
  cursor: pointer;
  
  /* Ajustes para o ícone ficar bem centralizado */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: background-color 0.2s, color 0.2s;
}

.btn-logout:hover {
  background-color: #f0f0f0;
  color: var(--cor-erro);
}
</style>