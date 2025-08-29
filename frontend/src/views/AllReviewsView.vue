<template>
  <div>
    <h1 class="title">Mural de Reviews</h1>
    <div v-if="isLoading" class="loading">Carregando reviews...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="reviewsData && reviewsData.reviews.length > 0">
      <div class="reviews-list">
        <div class="card" v-for="review in reviewsData.reviews" :key="review.id">
          <p class="review-content">"{{ review.conteudo }}"</p>
          <div class="review-footer">
            <div class="author-info">
              <span class="author">- {{ review.usuario }}</span>
              <small class="review-date">{{ formatDate(review.data_criacao) }}</small>
            </div>
            <div class="actions">
              <span class="points">+{{ review.pontos_ganhos }} pts</span>
              <button v-if="authStore.user?.isAdmin" @click="handleDelete(review.id)" class="btn-delete" title="Deletar Review">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
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
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { Trash2 } from 'lucide-vue-next';

const reviewsData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// 1. Nova função para formatar a data e hora
const formatDate = (isoString) => {
  if (!isoString) return '';
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(isoString).toLocaleString('pt-BR', options);
};

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
  if (page > 0 && page <= reviewsData.value.totalPages) {
    router.push({ query: { page } });
  }
};

const handleDelete = async (reviewId) => {
  if (confirm('Tem certeza que deseja deletar esta review? Os pontos do usuário serão revertidos.')) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deletada com sucesso!');
      fetchReviews(parseInt(route.query.page) || 1);
    } catch (err) {
      toast.error('Não foi possível deletar a review.');
      console.error(err);
    }
  }
};

onMounted(() => {
  fetchReviews(parseInt(route.query.page) || 1);
});

watch(() => route.query.page, (newPage) => {
  fetchReviews(parseInt(newPage) || 1);
});
</script>

<style scoped>
.title { text-align: center; font-weight: 900; margin-bottom: 2rem; }
.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; }
.reviews-list { display: flex; flex-direction: column; gap: 1.5rem; }
.card { border-left: 4px solid var(--cor-secundaria); }
.review-content { margin-bottom: 1rem; font-style: italic; color: var(--cor-texto-suave); }
.review-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
.author { font-weight: 700; }
.points { font-weight: 700; color: var(--cor-sucesso); }
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
.actions { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
}
.btn-delete {
  background: none;
  border: none;
  color: var(--cor-texto-suave);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;
}
.btn-delete:hover {
  color: var(--cor-erro);
  background-color: #ffeded;
}

/* 3. Novos estilos para agrupar autor e data */
.author-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.review-date {
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
  opacity: 0.8;
}
</style>