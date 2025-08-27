<template>
  <TheHeader v-if="authStore.isAuthenticated" />
  <main class="main-content">
    <RouterView />
  </main>
  <TheNavbar v-if="authStore.isAuthenticated" />
</template>

<script setup>
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import TheNavbar from '@/components/TheNavbar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<style>
/* Adicionamos uma classe para o conteúdo principal */
.main-content {
  padding-top: 60px; /* Altura do nosso novo cabeçalho */
  padding-bottom: 70px; /* Altura da nossa navbar */
}
</style>