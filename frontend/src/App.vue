<template>
  <RouterView />
  <TheNavbar v-if="authStore.isAuthenticated" />
</template>

<script setup>
import { RouterView } from 'vue-router';
import TheNavbar from '@/components/TheNavbar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>