<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-link">
      <Home :size="28" />
      <span>Home</span>
    </RouterLink>
    <RouterLink to="/ranking" class="nav-link">
      <Trophy :size="28" />
      <span>Ranking</span>
    </RouterLink>
    <RouterLink to="/reviews" class="nav-link">
      <ClipboardList :size="28" />
      <span>Reviews</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
// Importamos todos os ícones que vamos usar na navbar
import { Home, Trophy, ClipboardList } from 'lucide-vue-next';
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  background-color: var(--cor-container);
  border-top: 1px solid var(--cor-borda);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}
.nav-link {
  color: var(--cor-texto-suave);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.75rem;
  transition: color 0.2s;
}
/* A tag do ícone agora é o próprio nome do componente (ex: Home, Trophy) */
.nav-link :deep(svg) {
  width: 28px;
  height: 28px;
}
.router-link-exact-active {
  color: var(--cor-secundaria);
  font-weight: 700;
}
</style>