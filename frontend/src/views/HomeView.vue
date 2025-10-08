<template>
  <div 
    class="home-container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="pull-to-refresh-indicator" :style="{ transform: `translateY(${pullDistance}px)`, opacity: pullDistance > 0 || isRefreshing ? 1 : 0 }">
      <div class="icon-wrapper" :class="{ refreshing: isRefreshing }">
        <Loader v-if="isRefreshing" :size="24" />
        <ArrowDown v-else :size="24" :style="{ transform: `rotate(${pullDistance / 2}deg)` }" />
      </div>
    </div>

    <div class="card create-review-card">
      <div v-if="!hasSubmittedToday" class="form-content">
        <form @submit.prevent="handleSubmitReview" class="review-form">
          <textarea
            ref="textareaRef"
            v-model="reviewContent"
            placeholder="O que você aprendeu hoje?"
            class="input-field expanding-textarea"
            @input="autoResizeTextarea"
            rows="1"
            maxlength="500"
          ></textarea>
          <div class="form-actions">
            <small class="char-counter">{{ reviewContent.length }} / 500</small>
            <button type="submit" class="btn-primary" :disabled="isSubmitting || reviewContent.length === 0">
              {{ isSubmitting ? 'Enviando...' : 'Postar' }}
            </button>
          </div>
        </form>
      </div>
      <div v-else class="submitted-state">
        <CheckCircle2 :size="32" class="success-icon" />
        <div class="submitted-text">
          <h2 class="form-title">Parabéns!</h2>
          <p>Você já completou seu estudo de hoje.</p>
        </div>
        <button v-if="authStore.user?.isAdmin" @click="writeAnother" class="btn-another-review">
          Escrever Outra
        </button>
      </div>
    </div>

    <div v-if="isLoading && !isRefreshing" class="loading">Carregando feed...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="reviewsData && reviewsData.reviews.length > 0" class="feed-container">
      <div class="reviews-list">
        <ReviewCard 
          v-for="review in reviewsData.reviews" 
          :key="review.id"
          :review="review"
          @review-deleted="handleReviewDeleted"
        />
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { CheckCircle2, ArrowDown, Loader } from 'lucide-vue-next';
import ReviewCard from '@/components/ReviewCard.vue';

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
const textareaRef = ref(null);

const pullStartY = ref(0);
const pullDistance = ref(0);
const isRefreshing = ref(false);
const PULL_THRESHOLD = 80;

const fetchInitialData = async () => {
  if (!isRefreshing.value) {
    isLoading.value = true;
  }
  error.value = null;
  try {
    const page = 1;
    router.replace({ query: {} }); 

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

const autoResizeTextarea = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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
    if (reviewsData.value?.reviews) {
        reviewsData.value.reviews.unshift(newReview);
    } else {
        reviewsData.value = { reviews: [newReview], totalPages: 1, currentPage: 1 };
    }
    
    reviewContent.value = '';
    if (textareaRef.value) textareaRef.value.style.height = 'auto';

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

const handleReviewDeleted = (deletedReviewId) => {
  if (reviewsData.value) {
    reviewsData.value.reviews = reviewsData.value.reviews.filter(r => r.id !== deletedReviewId);
  }
};

const onTouchStart = (e) => {
  if (window.scrollY === 0) {
    pullStartY.value = e.touches[0].clientY;
  } else {
    pullStartY.value = 0;
  }
};

const onTouchMove = (e) => {
  if (pullStartY.value === 0) return;
  const currentY = e.touches[0].clientY;
  let distance = currentY - pullStartY.value;
  if (distance > 0) {
    e.preventDefault();
    pullDistance.value = Math.pow(distance, 0.85);
  }
};

const handleRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  pullDistance.value = 60;
  
  await fetchInitialData();
  
  isRefreshing.value = false;
  pullStartY.value = 0;
  pullDistance.value = 0;
};

const onTouchEnd = () => {
  if (pullDistance.value > PULL_THRESHOLD) {
    handleRefresh();
  } else {
    pullStartY.value = 0;
    pullDistance.value = 0;
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent.value = e;
    showInstallBanner.value = true;
  });
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
  fetchInitialData();
});

onUnmounted(() => {
  document.removeEventListener('touchstart', onTouchStart);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
});

watch(() => route.query.page, (newPage, oldPage) => {
  if (newPage && (newPage !== oldPage)) {
    fetchReviewsOnly();
  }
});
</script>

<style scoped>
.home-container {
  position: relative;
  padding-top: 50px;
  margin-top: -50px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.pull-to-refresh-indicator {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  opacity: 0;
}
.pull-to-refresh-indicator[style*="translateY(0px)"] {
  /* Mantém o ícone invisível quando não está sendo puxado */
  opacity: 0 !important;
}
.icon-wrapper {
  background-color: var(--cor-container);
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: var(--cor-texto-suave);
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-wrapper.refreshing .lucide-loader {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.create-review-card {
  padding: 1rem;
}
.form-content {
  display: flex;
  gap: 1rem;
}
.review-form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.expanding-textarea {
  resize: none;
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 1.1rem;
  line-height: 1.5;
  min-height: 28px;
  overflow-y: hidden;
  border-bottom: 1px solid var(--cor-borda);
}
.expanding-textarea:focus {
  border-color: var(--cor-secundaria);
  outline: none;
  box-shadow: none;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.char-counter {
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
}
.btn-submit-review {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 20px;
  border-bottom-width: 3px;
  text-transform: none;
}
.btn-submit-review:disabled {
  background-color: #a0c3f0;
  border-bottom-color: #a0c3f0;
}
.submitted-state {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.success-icon {
  color: var(--cor-primaria);
}
.submitted-text {
  flex-grow: 1;
  text-align: left;
}
.submitted-state .form-title {
  font-size: 1.1rem;
  margin-bottom: 0;
}
.submitted-state p {
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
}
.btn-another-review {
  font-size: 0.8rem;
  flex-shrink: 0;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cor-texto-suave);
}
.loading, .no-data, .error-message {
  text-align: center;
  margin-top: 2rem;
}
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.reviews-list > :deep(.card) {
  border-top: 1px solid var(--cor-borda);
  border-left: none;
  border-radius: 0;
  box-shadow: none;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}
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
.install-banner {
  position: fixed;
  bottom: 80px;
  left: 1.5rem;
  right: 1.5rem;
  max-width: calc(500px - 3rem);
  margin: 0 auto;
  background-color: var(--cor-secundaria);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slide-up 0.5s ease-out;
  z-index: 20;
}
@keyframes slide-up {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.btn-install {
  background-color: var(--cor-container);
  color: var(--cor-secundaria);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}
</style>