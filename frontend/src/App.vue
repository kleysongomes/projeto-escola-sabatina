<template>
  <TheHeader v-if="authStore.isAuthenticated" />
  <main class="main-content">
    <RouterView />
  </main>
  <TheNavbar v-if="authStore.isAuthenticated" />
</template>

<script setup>
import { watch, onMounted } from 'vue'; // 1. Importar watch e onMounted
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import TheNavbar from '@/components/TheNavbar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
};

onMounted(() => {
  if (authStore.user?.tema) {
    applyTheme(authStore.user.tema);
  }
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