<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-link">
      <span>Home</span>
    </RouterLink>
    <RouterLink to="/ranking" class="nav-link">
      <span>Ranking</span>
    </RouterLink>
    <RouterLink to="/reviews" class="nav-link">
      <span>Reviews</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 500px; /* Mesma largura do #app para centralizar */
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  background-color: var(--cor-fundo-secundaria);
  padding: 0.8rem 0;
  border-top: 1px solid var(--cor-primaria);
}
.nav-link {
  color: var(--cor-texto);
  opacity: 0.7;
  font-size: 0.9rem;
}
/* Estilo para o link da rota ativa */
.router-link-exact-active {
  color: var(--cor-destaque);
  opacity: 1;
  font-weight: bold;
}
</style>