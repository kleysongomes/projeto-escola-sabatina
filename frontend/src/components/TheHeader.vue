<template>
  <header class="header-background">
    <div class="header-content">
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
    </div>
  </header>
</template>

<script setup>
// Nenhuma alteração no script
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
/* O container externo que cuida do fundo e da posição */
.header-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Ocupa a largura toda */
  background-color: var(--cor-container);
  border-bottom: 1px solid var(--cor-borda);
  z-index: 10;
  display: flex;
  justify-content: center; /* Centraliza o conteúdo interno */
}

/* O container interno que limita o conteúdo ao layout do app */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px; /* Largura máxima do conteúdo */
  height: 60px;
  padding: 0 1.5rem; /* Padding para as laterais */
}

.left-actions, .right-actions {
  flex: 1;
}
.right-actions {
  display: flex;
  justify-content: flex-end;
}
.header-logo {
  height: 80px;
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