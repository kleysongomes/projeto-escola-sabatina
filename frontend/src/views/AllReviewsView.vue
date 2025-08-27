<template>
  <div>
    <h1 class="title">Últimas Reviews</h1>
    <div v-if="isLoading" class="loading">Carregando reviews...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="reviewsData && reviewsData.reviews.length > 0">
      <ul class="reviews-list">
        <li v-for="review in reviewsData.reviews" :key="review.id">
          <p class="review-content">"{{ review.conteudo }}"</p>
          <div class="review-footer">
            <span class="author">- {{ review.usuario }}</span>
            <span class="points">+{{ review.pontos_ganhos }} pts</span>
          </div>
        </li>
      </ul>
       <div class="pagination">
        <button @click="changePage(reviewsData.currentPage - 1)" :disabled="reviewsData.currentPage <= 1">Anterior</button>
        <span>Página {{ reviewsData.currentPage }} de {{ reviewsData.totalPages }}</span>
        <button @click="changePage(reviewsData.currentPage + 1)" :disabled="reviewsData.currentPage >= reviewsData.totalPages">Próximo</button>
      </div>
    </div>
    <div v-else class="no-data">Nenhuma review foi enviada ainda.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

const reviewsData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();

const fetchReviews = async (page) => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/reviews?page=${page}`);
    reviewsData.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar as reviews.';
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  router.push({ query: { page } });
};

onMounted(() => {
  const page = parseInt(route.query.page) || 1;
  fetchReviews(page);
});

watch(() => route.query.page, (newPage) => {
  fetchReviews(parseInt(newPage) || 1);
});
</script>

<style scoped>
.title { color: var(--cor-destaque); text-align: center; margin-bottom: 2rem; }
.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; opacity: 0.8; }
.reviews-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1.5rem; }
.reviews-list li { background-color: var(--cor-fundo-secundaria); padding: 1.2rem; border-radius: 8px; border-left: 4px solid var(--cor-primaria); }
.review-content { margin-bottom: 1rem; font-style: italic; }
.review-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; opacity: 0.8; }
.points { font-weight: bold; color: var(--cor-sucesso); }
.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
.pagination button { background: none; border: 1px solid var(--cor-primaria); color: var(--cor-primaria); padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>