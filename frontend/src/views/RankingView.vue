<template>
  <div>
    <h1 class="title">Ranking de Estudantes</h1>
    <div v-if="isLoading" class="loading">Carregando ranking...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="rankingData && rankingData.ranking.length > 0">
      <ol class="ranking-list">
        <li v-for="(user, index) in rankingData.ranking" :key="user.id">
          <span class="rank-position">#{{ (rankingData.currentPage - 1) * 10 + index + 1 }}</span>
          <div class="user-info">
            <span class="username">{{ user.usuario }}</span>
            <span class="location">{{ user.cidade }}, {{ user.pais }}</span>
          </div>
          <span class="points">{{ user.pontos_totais }} pts</span>
        </li>
      </ol>
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

const rankingData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();

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
  router.push({ query: { page } });
};

onMounted(() => {
  const page = parseInt(route.query.page) || 1;
  fetchRanking(page);
});

watch(() => route.query.page, (newPage) => {
  fetchRanking(parseInt(newPage) || 1);
});
</script>

<style scoped>
.title { color: var(--cor-destaque); text-align: center; margin-bottom: 2rem; }
.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; opacity: 0.8; }
.ranking-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
.ranking-list li { display: flex; align-items: center; background-color: var(--cor-fundo-secundaria); padding: 1rem; border-radius: 8px; }
.rank-position { font-size: 1.2rem; font-weight: bold; color: var(--cor-primaria); min-width: 40px; }
.user-info { flex-grow: 1; }
.username { font-weight: bold; display: block; }
.location { font-size: 0.8rem; opacity: 0.7; }
.points { font-weight: bold; color: var(--cor-sucesso); }
.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
.pagination button { background: none; border: 1px solid var(--cor-primaria); color: var(--cor-primaria); padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>