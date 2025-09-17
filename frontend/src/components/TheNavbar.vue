<template>
  <nav class="navbar-background">
    <div class="navbar-content">
      <RouterLink to="/" class="nav-link" title="Home">
        <SquarePen :size="28" />
      </RouterLink>
      <RouterLink to="/reviews" class="nav-link" title="Mural de Reviews">
        <ClipboardList :size="28" />
      </RouterLink>
      <RouterLink to="/ranking" class="nav-link" title="Ranking">
        <Trophy :size="28" />
      </RouterLink>
      <RouterLink to="/perfil" class="nav-link" title="Meu Perfil">
        <UserCircle2 :size="28" />
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { SquarePen, Trophy, ClipboardList, UserCircle2 } from 'lucide-vue-next';
</script>

<style scoped>

.navbar-background {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--cor-container);
  border-top: 1px solid var(--cor-borda);
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  z-index: 10;
}
.navbar-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 500px;
  height: 65px;
  padding: 0 1.5rem;
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