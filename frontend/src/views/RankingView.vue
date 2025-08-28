<template>
  <div>
    <h1 class="title">Ranking de Estudantes</h1>
    <div v-if="isLoading" class="loading">Carregando ranking...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="rankingData && rankingData.ranking.length > 0">
      <div class="card ranking-card">
        <ol class="ranking-list">
          <li v-for="(user, index) in rankingData.ranking" :key="user.id" :class="{ 'current-user': user.id === authStore.user?.id }">
            <span class="rank-position">#{{ (rankingData.currentPage - 1) * 10 + index + 1 }}</span>
            <div class="user-info">
              <span class="username">{{ user.usuario }}</span>
              <span class="location">{{ user.cidade }}, {{ user.pais }}</span>
            </div>
            <span class="points">{{ user.pontos_totais }} pts</span>
          </li>
        </ol>
      </div>
      <div class="pagination">
        <button @click="changePage(rankingData.currentPage - 1)" :disabled="rankingData.currentPage <= 1">Anterior</button>
        <span>Página {{ rankingData.currentPage }} de {{ rankingData.totalPages }}</span>
        <button @click="changePage(rankingData.currentPage + 1)" :disabled="rankingData.currentPage >= rankingData.totalPages">Próximo</button>
      </div>
    </div>
    <div v-else class="no-data">Ainda não há usuários no ranking.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth'; // 1. IMPORTAR O AUTH STORE

const rankingData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); // 2. INSTANCIAR O AUTH STORE

const fetchRanking = async (page) => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/usuarios/ranking?page=${page}`);
    rankingData.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar o ranking.';
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page > 0 && page <= rankingData.value.totalPages) {
    router.push({ query: { page } });
  }
};

onMounted(() => {
  fetchRanking(parseInt(route.query.page) || 1);
});

watch(() => route.query.page, (newPage) => {
  fetchRanking(parseInt(newPage) || 1);
});
</script>

<style scoped>
.title { text-align: center; font-weight: 900; margin-bottom: 2rem; color: var(--cor-texto); }
.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; }
.ranking-card { padding: 0.5rem 1rem; }
.ranking-list { list-style: none; padding: 0; }
.ranking-list li { display: flex; align-items: center; padding: 1rem 0.5rem; border-bottom: 1px solid var(--cor-borda); }
.ranking-list li:last-child { border-bottom: none; }
.rank-position { font-size: 1.2rem; font-weight: 900; color: var(--cor-texto-suave); min-width: 45px; }
.user-info { flex-grow: 1; }
.username { font-weight: 700; }
.location { font-size: 0.9rem; color: var(--cor-texto-suave); }
.points { font-weight: 900; font-size: 1.1rem; color: var(--cor-secundaria); }
.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
.pagination span { color: var(--cor-texto-suave); font-weight: 700; }
.pagination button {
  background-color: var(--cor-container);
  border: 2px solid var(--cor-borda);
  color: var(--cor-texto-suave);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 3. ADICIONAR ESTE ESTILO PARA O DESTAQUE */
.ranking-list li.current-user {
  background-color: #e0f2fe; /* Um azul bem claro */
  border: 2px solid var(--cor-secundaria);
  border-radius: 8px;
  margin: 0 -0.5rem; /* Compensa o padding para alinhar a borda */
  padding: 1rem;
}

.current-user .username {
  color: var(--cor-secundaria);
}
</style>