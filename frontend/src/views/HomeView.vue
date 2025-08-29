<template>
  <div class="home-container">
    <div v-if="isLoading" class="loading">Carregando lição...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="lesson" class="lesson-content">
      <div class="card lesson-card">
        <span class="lesson-date">Título da lição de hoje {{ lesson.date }}</span>
        <h1 class="lesson-title">{{ lesson.title }}</h1>
      </div>
      <br/>
      <div class="card review-card">
        <form v-if="!hasSubmittedToday" @submit.prevent="handleSubmitReview">
          <h2 class="form-title">Qual foi o seu aprendizado?</h2>
          <div class="textarea-wrapper">
            <textarea
              v-model="reviewContent"
              placeholder="Escreva aqui sua reflexão sobre o estudo de hoje..."
              rows="8"
              required
              class="input-field"
              maxlength="300" 
            ></textarea>
            <small class="char-counter">{{ reviewContent.length }} / 300</small>
          </div>
          
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar review' }}
          </button>
        </form>

        <div v-else class="submitted-state">
          <CheckCircle2 :size="60" class="success-icon" />
          <h2 class="form-title">Parabéns!</h2>
          <p>Você já completou seu estudo de hoje. Volte amanhã para ganhar mais pontos!</p>
          <RouterLink to="/reviews" class="btn-secondary">Ver outras reviews</RouterLink>

          <button v-if="authStore.user?.isAdmin" @click="writeAnother" class="btn-another-review">
            Escrever Outra Review (Admin)
          </button>
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
import { RouterLink } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { CheckCircle2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

// O script permanece o mesmo, a validação principal é feita pelo maxlength no template
const lesson = ref(null);
const reviewContent = ref('');
const isLoading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);
const hasSubmittedToday = ref(false);
const toast = useToast();
const installPromptEvent = ref(null);
const showInstallBanner = ref(false);
const authStore = useAuthStore();

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent.value = e;
    showInstallBanner.value = true;
  });
  
  const cachedLesson = JSON.parse(localStorage.getItem('cachedLesson'));
  const todayStr = new Date().toLocaleDateString('pt-BR');

  if (cachedLesson && cachedLesson.dateStr === todayStr) {
    console.log("Lição carregada do cache!");
    lesson.value = cachedLesson.data;
    hasSubmittedToday.value = cachedLesson.data.userHasSubmitted;
    isLoading.value = false;
  } else {
    console.log("Cache antigo ou inexistente. Buscando na API.");
    fetchLesson();
  }
});

const fetchLesson = async () => {
  try {
    const response = await api.get('/lessons/today');
    lesson.value = response.data;
    hasSubmittedToday.value = response.data.userHasSubmitted; 

    const todayStr = new Date().toLocaleDateString('pt-BR');
    const lessonToCache = {
      dateStr: todayStr,
      data: response.data,
    };
    localStorage.setItem('cachedLesson', JSON.stringify(lessonToCache));

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

    if (!authStore.user?.isAdmin) {
      hasSubmittedToday.value = true;
    }
    
    const cachedLesson = JSON.parse(localStorage.getItem('cachedLesson'));
    if (cachedLesson) {
      if (!authStore.user?.isAdmin) {
        cachedLesson.data.userHasSubmitted = true;
        localStorage.setItem('cachedLesson', JSON.stringify(cachedLesson));
      }
    }

  } catch (err) {
    toast.error(err.response?.data?.error || 'Ocorreu um erro ao enviar.');
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const writeAnother = () => {
  hasSubmittedToday.value = false;
};
</script>

<style scoped>
/* Os estilos permanecem os mesmos da versão anterior */
.home-container { 
  display: flex; 
  flex-direction: column; 
  gap: 1.5rem;
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

/* 2. ADICIONADO: Wrapper para textarea e contador */
.textarea-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

textarea { 
  resize: vertical; 
  /* removemos a margem daqui para o wrapper controlar */
}

/* 3. ADICIONADO: Estilo do contador */
.char-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
}

.btn-primary:disabled {
  background-color: var(--cor-texto-suave);
  border-bottom-color: var(--cor-texto-suave);
  cursor: not-allowed;
}
.review-card form .btn-primary {
  width: 100%;
}
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
.btn-another-review {
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: var(--cor-texto-suave);
  text-decoration: underline;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  padding: 0.5rem;
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