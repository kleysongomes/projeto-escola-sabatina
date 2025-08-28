<template>
  <div class="home-container">
    <div v-if="isLoading" class="loading">Carregando lição...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="lesson" class="lesson-content">
      <div class="card lesson-card">
        <span class="lesson-date">{{ lesson.date }}</span>
        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </div>
      <br/>
      <div class="card review-card">
        <form v-if="!hasSubmittedToday" @submit.prevent="handleSubmitReview">
          <h2 class="form-title">Qual foi o seu aprendizado?</h2>
          <textarea
            v-model="reviewContent"
            placeholder="Escreva aqui sua reflexão sobre o estudo de hoje..."
            rows="8"
            required
            class="input-field"
          ></textarea>
          
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar e ganhar pontos' }}
          </button>
        </form>

        <div v-else class="submitted-state">
          <CheckCircle2 :size="60" class="success-icon" />
          <h2 class="form-title">Parabéns!</h2>
          <p>Você já completou seu estudo de hoje. Volte amanhã para ganhar mais pontos!</p>
          <RouterLink to="/reviews" class="btn-secondary">Ver outras reviews</RouterLink>
        </div>
      </div>
    </div>

    <div v-if="showInstallBanner" class="install-banner">
      <span>Instale o app para uma melhor experiência!</span>
      <button @click="triggerInstallPrompt" class="btn-install">Instalar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router'; // 1. Importar RouterLink
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { CheckCircle2 } from 'lucide-vue-next'; // 2. Importar o ícone de check

// Refs
const lesson = ref(null);
const reviewContent = ref('');
const isLoading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);
const hasSubmittedToday = ref(false); // 3. Novo Ref para controlar a exibição
const toast = useToast();
const installPromptEvent = ref(null);
const showInstallBanner = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent.value = e;
    showInstallBanner.value = true;
  });
  fetchLesson();
});

const fetchLesson = async () => {
  try {
    const response = await api.get('/lessons/today');
    lesson.value = response.data;
    // 4. Guardamos o status que veio do backend
    hasSubmittedToday.value = response.data.userHasSubmitted; 
  } catch (err) {
    error.value = 'Não foi possível carregar a lição de hoje.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const triggerInstallPrompt = async () => {
  if (!installPromptEvent.value) return;
  installPromptEvent.value.prompt();
  const { outcome } = await installPromptEvent.value.userChoice;
  if (outcome === 'accepted') console.log('Usuário aceitou a instalação do PWA');
  else console.log('Usuário recusou a instalação do PWA');
  installPromptEvent.value = null;
  showInstallBanner.value = false;
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
      indiceLicao: lesson.value.index,
    });
    toast.success(`Parabéns! Você ganhou ${response.data.pontos_ganhos} pontos!`);
    reviewContent.value = '';
    // 5. Atualizamos o status para trocar a view instantaneamente
    hasSubmittedToday.value = true; 
  } catch (err) {
    toast.error(err.response?.data?.error || 'Ocorreu um erro ao enviar.');
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.home-container { 
  display: flex; 
  flex-direction: column; 
  gap: 1.5rem; /* Ajustei o espaçamento */
}
.loading, .error-message { 
  text-align: center; 
  margin-top: 4rem; 
  font-size: 1.2rem; 
}
.lesson-card { 
  text-align: center; 
  border-top: 4px solid var(--cor-secundaria); 
}
.lesson-date { 
  color: var(--cor-texto-suave); 
  font-weight: 700; 
}
.lesson-title { 
  font-size: 2rem; 
  font-weight: 900; 
  line-height: 1.2; 
}
.review-card { 
  border-top: 4px solid var(--cor-primaria); 
}
.form-title { 
  font-weight: 900; 
  margin-bottom: 1rem; 
  text-align: center; 
}
textarea { 
  resize: vertical; 
  margin-bottom: 1.5rem; 
}
.btn-primary:disabled {
  background-color: var(--cor-texto-suave);
  border-bottom-color: var(--cor-texto-suave);
  cursor: not-allowed;
}

/* 6. ESTILOS PARA O NOVO CARD DE "TAREFA CONCLUÍDA" */
.submitted-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  color: var(--cor-primaria);
}

.submitted-state p {
  color: var(--cor-texto-suave);
  max-width: 80%;
  margin: 0 auto;
}

.btn-secondary {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--cor-container);
  color: var(--cor-secundaria);
  border: 2px solid var(--cor-secundaria);
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.btn-secondary:hover {
  background-color: var(--cor-secundaria);
  color: var(--cor-container);
}

/* Estilos para o banner de instalação do PWA */
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
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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