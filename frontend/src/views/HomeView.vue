<template>
  <div class="home-container">
    <div v-if="isLoading" class="loading">Carregando lição...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="lesson" class="lesson-content">
      <div class="card lesson-card">
        <span class="lesson-date">{{ lesson.date }}</span>
        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </div>

      <div class="card review-card">
        <form @submit.prevent="handleSubmitReview">
          <h2 class="form-title">Qual foi o seu aprendizado?</h2>
          <textarea
            v-model="reviewContent"
            placeholder="Escreva aqui sua reflexão sobre o estudo de hoje..."
            rows="8"
            required
            class="input-field"
          ></textarea>
          
          <div class="button-wrapper">
            <button v-if="!submissionSuccess && !submissionError" type="submit" class="btn-primary">Enviar e ganhar pontos</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// O SCRIPT SETUP CONTINUA IGUAL!
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const lesson = ref(null);
const reviewContent = ref('');
const isLoading = ref(true);
const error = ref(null);
const submissionError = ref(null);
const submissionSuccess = ref(null);

onMounted(async () => {
  try {
    const response = await api.get('/lessons/today');
    lesson.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar a lição de hoje.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const handleSubmitReview = async () => {
  submissionError.value = null;
  submissionSuccess.value = null;
  if (!reviewContent.value.trim()) {
    submissionError.value = 'Sua review não pode estar em branco.';
    return;
  }
  try {
    const payload = {
      conteudo: reviewContent.value,
      indiceLicao: lesson.value.index,
    };
    const response = await api.post('/reviews', payload);
    submissionSuccess.value = `Parabéns! Você ganhou ${response.data.pontos_ganhos} pontos!`;
  } catch (err) {
    submissionError.value = err.response?.data?.error || 'Ocorreu um erro ao enviar.';
    console.error(err);
  }
};
</script>

<style scoped>
.home-container { display: flex; flex-direction: column; gap: 2rem; }
.loading, .error-message { text-align: center; margin-top: 4rem; font-size: 1.2rem; }
.lesson-card { text-align: center; border-top: 4px solid var(--cor-secundaria); }
.lesson-date { color: var(--cor-texto-suave); font-weight: 700; }
.lesson-title { font-size: 2rem; font-weight: 900; line-height: 1.2; }
.review-card { border-top: 4px solid var(--cor-primaria); }
.form-title { font-weight: 900; margin-bottom: 1rem; text-align: center; }
textarea { resize: vertical; margin-bottom: 1.5rem; }
.button-wrapper {
  text-align: center;
}
.success-message, .error-message { text-align: center; font-weight: 700; margin-top: 1rem; }
.success-message { color: var(--cor-primaria); }
</style>