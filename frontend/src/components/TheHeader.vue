<template>
  <header class="header">
    <div class="left-actions">
      <RouterLink to="/sobre" class="header-btn" aria-label="Sobre o projeto">
        <HelpCircle :size="22" />
      </RouterLink>
    </div>

    <h2 class="header-title">Check in Lição</h2>

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
// 4. Importar o novo ícone HelpCircle
import { LogOut, HelpCircle } from 'lucide-vue-next';

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
  padding: 0.8rem 1rem; /* Padding ajustado */
  background-color: var(--cor-container);
  border-bottom: 1px solid var(--cor-borda);
  z-index: 10;
  height: 60px; /* Altura fixa para consistência */
}

/* 5. Divs para alinhar o título no centro */
.left-actions, .right-actions {
  flex: 1;
}
.right-actions {
  display: flex;
  justify-content: flex-end;
}

.header-title {
  flex: 2; /* Faz o título ocupar mais espaço */
  text-align: center;
  font-weight: 900;
  font-size: 1.2rem;
  color: var(--cor-texto);
}

/* 6. Estilo genérico para os botões do header */
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