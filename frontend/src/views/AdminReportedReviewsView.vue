<template>
  <div class="admin-container">
    <div class="header-nav">
      <button @click="router.back()" class="back-btn" aria-label="Voltar">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">
        Reviews Reportadas
      </h1>
    </div>

    <div v-if="isLoading" class="loading">Carregando reviews reportadas...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="reportedReviews.length > 0" class="report-list">
      <div v-for="report in reportedReviews" :key="report.review_id" class="card report-item">
        <div class="report-main">
          <p class="review-content">"{{ report.conteudo }}"</p>
          <div class="report-actions">
            <button @click="handleDelete(report.review_id)" class="action-btn delete-btn">
              <Trash2 :size="18" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
        <div class="report-meta">
          <span>Autor: <strong>{{ report.author_username }}</strong></span>
          <span>Reportada por: <strong>{{ report.reporter_username }}</strong></span>
          <span>Total de Reports: <strong>{{ report.report_count }}</strong></span>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
      Nenhuma review foi reportada. Tudo certo por aqui!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { ArrowLeft, Trash2 } from 'lucide-vue-next';

const reportedReviews = ref([]);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();
const toast = useToast();

const fetchReportedReviews = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/reviews/reported');
    reportedReviews.value = response.data;
  } catch (err) {
    error.value = "Não foi possível carregar as reviews reportadas.";
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (reviewId) => {
  if (confirm('Tem certeza que deseja EXCLUIR PERMANENTEMENTE esta review? A ação não pode ser desfeita.')) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deletada com sucesso!');
      reportedReviews.value = reportedReviews.value.filter(r => r.review_id !== reviewId);
    } catch (err) {
      toast.error('Não foi possível deletar a review.');
    }
  }
};

onMounted(() => {
  fetchReportedReviews();
});
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.header-nav {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-bottom: 1rem;
}
.back-btn {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: var(--cor-texto);
  cursor: pointer;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}
.loading, .error-message, .no-data {
  text-align: center;
  margin-top: 4rem;
  color: var(--cor-texto-suave);
}
.report-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.report-item {
  padding: 1.5rem;
  border-left: 4px solid var(--cor-erro);
}
.report-main {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}
.review-content {
  font-style: italic;
  color: var(--cor-texto-suave);
  flex-grow: 1;
}
.report-actions .delete-btn {
  background-color: #ffeded;
  color: var(--cor-erro);
  border: 1px solid var(--cor-erro);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.report-actions .delete-btn:hover {
  background-color: var(--cor-erro);
  color: white;
}
.report-meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--cor-borda);
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
}
.report-meta strong {
  color: var(--cor-texto);
}
</style>