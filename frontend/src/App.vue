<template>
  <TheHeader v-if="authStore.isAuthenticated" />
  <main class="main-content">
    <RouterView />
  </main>
  <TheNavbar v-if="authStore.isAuthenticated" />

  <transition name="fade">
    <button
      v-if="showScrollTopButton"
      @click="scrollToTop"
      class="scroll-to-top-btn"
      aria-label="Voltar ao topo"
    >
      <ArrowUp :size="24" />
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import TheNavbar from '@/components/TheNavbar.vue';
import { useAuthStore } from './stores/auth';
import { ArrowUp } from 'lucide-vue-next';

const authStore = useAuthStore();
const showScrollTopButton = ref(false);

// Lógica do Tema
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
};

// Lógica do Botão de Voltar ao Topo
const handleScroll = () => {
  // Mostra o botão se o usuário rolou mais de 300 pixels para baixo
  showScrollTopButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  // Aplica o tema inicial
  if (authStore.user?.tema) {
    applyTheme(authStore.user.tema);
  }
  // Adiciona o "ouvinte" de rolagem
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // Remove o "ouvinte" ao sair para evitar problemas de memória
  window.removeEventListener('scroll', handleScroll);
});

watch(() => authStore.user?.tema, (newTheme) => {
  applyTheme(newTheme);
});
</script>

<style>
.main-content {
  padding-top: 60px;
  padding-bottom: 70px;
}
</style>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 85px; /* Posição acima da navbar */
  right: 1.5rem;
  z-index: 20;
  
  background-color: var(--cor-secundaria);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-to-top-btn:hover {
  transform: scale(1.1);
}

/* Animação de fade para o botão */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>