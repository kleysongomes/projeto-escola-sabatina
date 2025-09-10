<template>
  <nav class="navbar-background">
    <div class="navbar-content">
      <RouterLink to="/" class="nav-link" title="Home">
        <SquarePen :size="28" />
      </RouterLink>
      <RouterLink to="/ranking" class="nav-link" title="Ranking">
        <Trophy :size="28" />
      </RouterLink>
      <RouterLink to="/reviews" class="nav-link" title="Mural de Reviews">
        <ClipboardList :size="28" />
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
// Nenhuma alteração no script
import { RouterLink } from 'vue-router';
import { SquarePen, Trophy, ClipboardList } from 'lucide-vue-next';
</script>

<style scoped>
/* O container externo que cuida do fundo e da posição */
.navbar-background {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%; /* Ocupa a largura toda */
  background-color: var(--cor-container);
  border-top: 1px solid var(--cor-borda);
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center; /* Centraliza o conteúdo interno */
  z-index: 10;
}

/* O container interno que limita o conteúdo ao layout do app */
.navbar-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 500px; /* Largura máxima do conteúdo */
  height: 65px;
  padding: 0 1.5rem; /* Padding igual ao do app */
}

.nav-link {
  color: var(--cor-texto-suave);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  border-radius: 20px;
  transition: all 0.3s ease;
}
.nav-link:hover {
  background-color: var(--cor-fundo);
  color: var(--cor-secundaria);
}

.router-link-exact-active {
  color: var(--cor-secundaria);
  background-color: #e0f2fe;
}
</style>