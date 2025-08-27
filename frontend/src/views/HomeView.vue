<template>
  <div class="home-container">
    <header class="header">
      <h2>Escola Sabatina</h2>
      <button @click="handleLogout" class="btn-logout">Sair</button>
    </header>

    <main>
      <div v-if="isLoading" class="loading">Carregando lição...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="lesson" class="lesson-content">
        <h1 class="lesson-title">{{ lesson.title }}</h1>
        <p class="lesson-date">{{ lesson.date }}</p>

        <form @submit.prevent="handleSubmitReview">
          <textarea
            v-model="reviewContent"
            placeholder="O que você aprendeu hoje?"
            rows="8"
            required
          ></textarea>
          <button type="submit" class="btn-primary">Enviar Review</button>
        </form>
        <p v-if="submissionError" class="error-message">{{ submissionError }}</p>
        <p v-if="submissionSuccess" class="success-message">{{ submissionSuccess }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const lesson = ref(null);
const reviewContent = ref('');
const isLoading = ref(true);
const error = ref(null);
const submissionError = ref(null);
const submissionSuccess = ref(null);

// Função executada assim que o componente é montado na tela
onMounted(async () => {
  try {
    const response = await api.get('/lessons/today');
    lesson.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar a lição. Tente novamente mais tarde.';
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
    await api.post('/reviews', payload);
    submissionSuccess.value = 'Review enviada com sucesso! Você ganhou pontos!';
    reviewContent.value = ''; // Limpa a caixa de texto
  } catch (err) {
    // Pega a mensagem de erro específica do nosso backend
    submissionError.value = err.response?.data?.error || 'Ocorreu um erro ao enviar.';
    console.error(err);
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  color: var(--cor-destaque);
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: var(--cor-fundo-secundaria);
  color: var(--cor-texto);
  border: 1px solid var(--cor-erro);
  border-radius: 5px;
  cursor: pointer;
}

.loading {
  text-align: center;
  margin-top: 4rem;
  font-size: 1.2rem;
}

.lesson-content {
  text-align: center;
}

.lesson-title {
  font-size: 1.8rem;
  color: var(--cor-primaria);
  margin-bottom: 0.5rem;
}

.lesson-date {
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

textarea {
  padding: 0.8rem;
  background-color: var(--cor-fundo-secundaria);
  border: 1px solid var(--cor-texto);
  border-radius: 5px;
  color: var(--cor-texto);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--cor-primaria);
}

.btn-primary {
  padding: 0.9rem;
  background-color: var(--cor-primaria);
  color: var(--cor-fundo);
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
}

.error-message {
  margin-top: 1rem;
  color: var(--cor-erro);
}

.success-message {
  margin-top: 1rem;
  color: var(--cor-sucesso);
}
</style>