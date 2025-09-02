<template>
  <div>
    <h1 class="title">Mural de Reviews</h1>
    <div v-if="isLoading" class="loading">Carregando reviews...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="reviewsData && reviewsData.reviews.length > 0">
      <div class="reviews-list">
        <div class="card" v-for="(review, index) in reviewsData.reviews" :key="review.id">
          <p class="review-content">"{{ review.conteudo }}"</p>
          <div class="review-footer">
            <div class="author-info">
              <span class="author">- {{ review.usuario }}</span>
              <small class="review-date">{{ formatDate(review.data_criacao) }}</small>
            </div>
            <div class="actions">
              <button @click="handleLike(review.id, index)" class="action-btn like-btn" :class="{ 'liked': review.isLikedByCurrentUser }" title="Curtir">
                <Heart :size="18" />
                <span>{{ review.likesCount }}</span>
              </button>
              
              <button v-if="canShare" @click="handleShare(review)" class="action-btn share-btn" title="Compartilhar">
                <Share2 :size="18" />
              </button>

              <button @click="handleReport(review.id)" class="action-btn report-btn" title="Reportar">
                <Flag :size="18" />
              </button>
              <button v-if="authStore.user?.isAdmin" @click="handleDelete(review.id)" class="action-btn delete-btn" title="Deletar Review">
                <Trash2 :size="18" />
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
import { Trash2, Heart, Flag, Share2 } from 'lucide-vue-next';

const reviewsData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const canShare = !!navigator.share;

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
  if (reviewsData.value && page > 0 && page <= reviewsData.value.totalPages) {
    router.push({ query: { ...route.query, page } });
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

const handleLike = async (reviewId, index) => {
  const review = reviewsData.value.reviews[index];
  review.isLikedByCurrentUser = !review.isLikedByCurrentUser;
  review.isLikedByCurrentUser ? review.likesCount++ : review.likesCount--;

  try {
    await api.post(`/reviews/${reviewId}/like`);
  } catch (err) {
    review.isLikedByCurrentUser = !review.isLikedByCurrentUser;
    review.isLikedByCurrentUser ? review.likesCount++ : review.likesCount--;
    toast.error('Ocorreu um erro ao processar sua curtida.');
    console.error(err);
  }
};

const handleReport = async (reviewId) => {
  if (confirm('Deseja reportar esta review por conteúdo inadequado?')) {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Não foi possível reportar a review.');
      console.error(err);
    }
  }
};

const handleShare = async (review) => {
  const siteUrl = 'https://projeto-escola-sabatina.onrender.com/';
  
  const shareData = {
    title: 'Review da Lição - Stud+',
    text: `Confira essa review de hoje no Stud+:\n\n"${review.conteudo}"\n\nEstude você também:`,
    url: siteUrl
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error('Erro ao compartilhar:', err);
  }
};

onMounted(() => {
  fetchReviews(parseInt(route.query.page) || 1);
});

watch(() => route.query, (newQuery) => {
  fetchReviews(parseInt(newQuery.page) || 1);
}, { deep: true });
</script>

<style scoped>
.title { text-align: center; font-weight: 900; margin-bottom: 2rem; }
.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; }
.reviews-list { display: flex; flex-direction: column; gap: 1.5rem; }
.card { border-left: 4px solid var(--cor-secundaria); }
.review-content { margin-bottom: 1rem; font-style: italic; color: var(--cor-texto-suave); }
.review-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.9rem; }
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
  gap: 0.75rem; 
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid var(--cor-borda);
  padding: 0.3rem 0.7rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
  transition: all 0.2s ease;
}
.action-btn:hover {
  border-color: var(--cor-texto);
  color: var(--cor-texto);
}
.like-btn.liked {
  background-color: #ffeded;
  color: var(--cor-erro);
  border-color: var(--cor-erro);
}
.like-btn.liked :deep(svg) {
  fill: var(--cor-erro);
}
.report-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}
.share-btn:hover {
  border-color: var(--cor-primaria);
  color: var(--cor-primaria);
}
.delete-btn {
  background-color: transparent;
  padding: 0.4rem;
  border: none;
}
.delete-btn:hover {
  color: var(--cor-erro);
  background-color: #ffeded;
}
.author-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.author { font-weight: 700; }
.review-date {
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
  opacity: 0.8;
}
</style>