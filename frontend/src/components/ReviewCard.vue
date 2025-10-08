<template>
  <div class="card review-card-item">
    <p class="review-content">"{{ displayText }}"</p>
    
    <div class="read-more-wrapper" v-if="isTruncated">
      <button @click="isExpanded = !isExpanded" class="btn-link">
        {{ isExpanded ? 'Ler Menos' : 'Ler Mais' }}
      </button>
    </div>

    <div class="review-footer">
      <div class="author-info">
        <span class="author">- {{ review.usuario }}</span>
        <small class="review-date">{{ formatDate(review.data_criacao) }}</small>
      </div>
      <div class="actions">
        <button @click="handleLike" class="action-btn like-btn" :class="{ 'liked': localReview.isLikedByCurrentUser }" title="Curtir">
          <Heart :size="18" />
          <span>{{ localReview.likesCount }}</span>
        </button>
        <button v-if="canShare" @click="handleShare" class="action-btn share-btn" title="Compartilhar">
          <Share2 :size="18" />
        </button>
        <button @click="handleReport" class="action-btn report-btn" title="Reportar">
          <Flag :size="18" />
        </button>
        <button v-if="authStore.user?.isAdmin" @click="handleDelete" class="action-btn delete-btn" title="Deletar Review">
          <Trash2 :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { Trash2, Heart, Flag, Share2 } from 'lucide-vue-next';

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['reviewDeleted']);
const authStore = useAuthStore();
const toast = useToast();
const canShare = !!navigator.share;
const localReview = ref({ ...props.review });
const isExpanded = ref(false);
const TRUNCATE_LENGTH = 280;

const isTruncated = computed(() => {
  return props.review.conteudo && props.review.conteudo.length > TRUNCATE_LENGTH;
});

const displayText = computed(() => {
  if (!props.review.conteudo) return '';
  if (isExpanded.value || !isTruncated.value) {
    return props.review.conteudo;
  }
  return props.review.conteudo.substring(0, TRUNCATE_LENGTH) + '...';
});

const formatDate = (isoString) => {
  if (!isoString) return '';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoString).toLocaleString('pt-BR', options);
};

const handleLike = async () => {
  localReview.value.isLikedByCurrentUser = !localReview.value.isLikedByCurrentUser;
  localReview.value.isLikedByCurrentUser ? localReview.value.likesCount++ : localReview.value.likesCount--;
  try {
    await api.post(`/reviews/${localReview.value.id}/like`);
  } catch (err) {
    localReview.value.isLikedByCurrentUser = !localReview.value.isLikedByCurrentUser;
    localReview.value.isLikedByCurrentUser ? localReview.value.likesCount++ : localReview.value.likesCount--;
    toast.error('Ocorreu um erro ao processar sua curtida.');
  }
};

const handleReport = async () => {
  if (confirm('Deseja reportar esta review por conteúdo inadequado?')) {
    try {
      const response = await api.post(`/reviews/${localReview.value.id}/report`);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Não foi possível reportar a review.');
    }
  }
};

const handleShare = async () => {
  const siteUrl = 'https://studup.app/';
  const shareData = {
    title: 'Review da Lição - Stud+',
    text: `Confira esta review no Stud+:\n\n"${localReview.value.conteudo}"\n\nEstude você também:`,
    url: siteUrl
  };
  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error('Erro ao compartilhar:', err);
  }
};

const handleDelete = async () => {
  if (confirm('Tem certeza que deseja deletar esta review? Os pontos do autor serão revertidos.')) {
    try {
      await api.delete(`/reviews/${localReview.value.id}`);
      toast.success('Review deletada com sucesso!');
      emit('reviewDeleted', localReview.value.id);
    } catch (err) {
      toast.error('Não foi possível deletar a review.');
    }
  }
};
</script>

<style scoped>
.review-card-item { 
  border-left: 4px solid var(--cor-secundaria);
  padding: 1.5rem; /* Adicionado padding para consistência */
}
.review-content {
  margin-bottom: 1rem;
  font-style: italic;
  color: var(--cor-texto-suave);
  white-space: pre-wrap;
  word-break: break-word;
}
.read-more-wrapper {
  text-align: right;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}
.btn-link {
  background: none; border: none; color: var(--cor-secundaria);
  font-weight: 700; cursor: pointer; text-decoration: underline; font-size: 0.9rem;
}
.review-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.9rem; }
.author-info { display: flex; flex-direction: column; align-items: flex-start; }
.author { font-weight: 700; }
.review-date { font-size: 0.8rem; color: var(--cor-texto-suave); opacity: 0.8; }

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
</style>