<template>
  <div class="home-container">
    <div class="card create-review-card">
      <div v-if="!hasSubmittedToday">
        <h2 class="form-title">O que você aprendeu hoje?</h2>
        <form @submit.prevent="handleSubmitReview">
          <div class="textarea-wrapper">
            <textarea
              v-model="reviewContent"
              placeholder="Escreva aqui sua reflexão..."
              rows="4"
              required
              class="input-field"
              maxlength="500" 
            ></textarea>
            <small class="char-counter">{{ reviewContent.length }} / 500</small>
          </div>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar Review' }}
          </button>
        </form>
      </div>
      <div v-else class="submitted-state">
        <CheckCircle2 :size="40" class="success-icon" />
        <div class="submitted-text">
          <h2 class="form-title">Parabéns!</h2>
          <p>Você já completou seu estudo de hoje. Volte amanhã!</p>
        </div>
        <button v-if="authStore.user?.isAdmin" @click="writeAnother" class="btn-another-review">
          Escrever Outra (Admin)
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Carregando reviews...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="reviewsData && reviewsData.reviews.length > 0" class="feed-container">
      <div class="reviews-list">
        <div class="card review-card-item" v-for="(review, index) in reviewsData.reviews" :key="review.id">
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
    <div v-else class="no-data">Nenhuma review foi enviada ainda. Seja o primeiro!</div>

    <div v-if="showInstallBanner" class="install-banner">
      <span>Instale o app para uma melhor experiência!</span>
      <button @click="triggerInstallPrompt" class="btn-install">Instalar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { CheckCircle2, Trash2, Heart, Flag, Share2 } from 'lucide-vue-next';

const reviewContent = ref('');
const isSubmitting = ref(false);
const hasSubmittedToday = ref(false);
const reviewsData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const installPromptEvent = ref(null);
const showInstallBanner = ref(false);
const canShare = !!navigator.share;

const formatDate = (isoString) => {
  if (!isoString) return '';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoString).toLocaleString('pt-BR', options);
};

const fetchInitialData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const page = parseInt(route.query.page) || 1;
    const [profileRes, reviewsRes] = await Promise.all([
      api.get('/usuarios/me'),
      api.get(`/reviews?page=${page}`)
    ]);
    hasSubmittedToday.value = profileRes.data.userHasSubmitted;
    reviewsData.value = reviewsRes.data;
  } catch (err) {
    error.value = 'Não foi possível carregar o feed.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const fetchReviewsOnly = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const page = parseInt(route.query.page) || 1;
    const response = await api.get(`/reviews?page=${page}`);
    reviewsData.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar as reviews.';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmitReview = async () => {
  if (!reviewContent.value.trim()) {
    toast.warning('Sua review não pode estar em branco.');
    return;
  }
  isSubmitting.value = true;
  try {
    const response = await api.post('/reviews', {
      conteudo: reviewContent.value,
      indiceLicao: new Date().toISOString().split('T')[0],
    });
    toast.success(`Parabéns! Você ganhou ${response.data.pontos_ganhos} pontos!`);
    
    const newReview = { ...response.data, usuario: authStore.user.usuario, likesCount: 0, isLikedByCurrentUser: false };
    reviewsData.value.reviews.unshift(newReview);
    
    reviewContent.value = '';
    if (!authStore.user?.isAdmin) {
      hasSubmittedToday.value = true;
    }
  } catch (err) {
    toast.error(err.response?.data?.error || 'Ocorreu um erro ao enviar.');
  } finally {
    isSubmitting.value = false;
  }
};

const writeAnother = () => { hasSubmittedToday.value = false; };

const changePage = (page) => {
  if (reviewsData.value && page > 0 && page <= reviewsData.value.totalPages) {
    router.push({ query: { page } });
  }
};

const triggerInstallPrompt = async () => {
  if (!installPromptEvent.value) return;
  installPromptEvent.value.prompt();
  installPromptEvent.value = null;
  showInstallBanner.value = false;
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
  }
};

const handleReport = async (reviewId) => {
  if (confirm('Deseja reportar esta review por conteúdo inadequado?')) {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Não foi possível reportar a review.');
    }
  }
};

const handleShare = async (review) => {
  const siteUrl = 'https://studup.app/';
  const shareData = {
    title: 'Review da Lição - Stud+',
    text: `Confira minha review de hoje no Stud+:\n\n"${review.conteudo}"\n\nEstude você também:`,
    url: siteUrl
  };
  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error('Erro ao compartilhar:', err);
  }
};

const handleDelete = async (reviewId) => {
  if (confirm('Tem certeza que deseja deletar esta review? Os pontos do usuário serão revertidos.')) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deletada com sucesso!');
      reviewsData.value.reviews = reviewsData.value.reviews.filter(r => r.id !== reviewId);
    } catch (err) {
      toast.error('Não foi possível deletar a review.');
    }
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent.value = e;
    showInstallBanner.value = true;
  });
  fetchInitialData();
});

watch(() => route.query.page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    fetchReviewsOnly();
  }
});
</script>

<style scoped>
.home-container { display: flex; flex-direction: column; gap: 2rem; }
.create-review-card { padding: 1.5rem; }
.form-title { font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; text-align: left; }
.textarea-wrapper { position: relative; margin-bottom: 1rem; }
textarea { resize: vertical; margin-bottom: 0; min-height: 50px; }
.char-counter { position: absolute; bottom: 10px; right: 10px; font-size: 0.8rem; color: var(--cor-texto-suave); }
.create-review-card .btn-primary { width: 100%; }
.submitted-state { display: flex; align-items: center; gap: 1rem; }
.success-icon { color: var(--cor-primaria); }
.submitted-text { flex-grow: 1; text-align: left; }
.submitted-state .form-title { font-size: 1.1rem; margin-bottom: 0; }
.submitted-state p { font-size: 0.9rem; color: var(--cor-texto-suave); }
.btn-another-review { font-size: 0.8rem; flex-shrink: 0; text-decoration: underline; background: none; border: none; cursor: pointer; color: var(--cor-texto-suave); }

.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; }
.reviews-list { display: flex; flex-direction: column; gap: 1.5rem; }
.review-card-item { border-left: 4px solid var(--cor-secundaria); }
.review-content { margin-bottom: 1rem; font-style: italic; color: var(--cor-texto-suave); }
.review-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.9rem; }
.author-info { display: flex; flex-direction: column; align-items: flex-start; }
.author { font-weight: 700; }
.review-date { font-size: 0.8rem; color: var(--cor-texto-suave); opacity: 0.8; }
.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
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
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

.actions { display: flex; align-items: center; gap: 0.75rem; }
.action-btn {
  display: flex; align-items: center; gap: 0.4rem; background: none;
  border: 1px solid var(--cor-borda); padding: 0.3rem 0.7rem; border-radius: 1rem;
  cursor: pointer; font-size: 0.9rem; color: var(--cor-texto-suave); transition: all 0.2s ease;
}
.action-btn:hover { border-color: var(--cor-texto); color: var(--cor-texto); }
.like-btn.liked { background-color: #ffeded; color: var(--cor-erro); border-color: var(--cor-erro); }
.like-btn.liked :deep(svg) { fill: var(--cor-erro); }
.report-btn:hover { border-color: #f59e0b; color: #f59e0b; }
.share-btn:hover { border-color: var(--cor-primaria); color: var(--cor-primaria); }
.delete-btn { background-color: transparent; padding: 0.4rem; border: none; }
.delete-btn:hover { color: var(--cor-erro); background-color: #ffeded; }
.install-banner {
  position: fixed; bottom: 80px; left: 1.5rem; right: 1.5rem;
  max-width: calc(500px - 3rem); margin: 0 auto; background-color: var(--cor-secundaria);
  color: white; padding: 1rem; border-radius: 12px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slide-up 0.5s ease-out;
  z-index: 20;
}
@keyframes slide-up {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.btn-install {
  background-color: var(--cor-container); color: var(--cor-secundaria);
  border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700;
  cursor: pointer;
}
</style>