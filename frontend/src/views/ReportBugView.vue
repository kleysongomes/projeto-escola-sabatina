<template>
  <div class="report-container">
    <div class="header-nav">
      <h1 class="page-title">Reportar um Problema</h1>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit">
        <p class="instructions">
          Encontrou um bug ou tem uma sugestão? Descreva com o máximo de detalhes possível. A sua ajuda é muito importante para melhorar o aplicativo!
        </p>
        <div class="textarea-wrapper">
          <textarea
            v-model="description"
            placeholder="Ex: Ao clicar no botão X na tela Y, a página ficou em branco."
            rows="10"
            required
            class="input-field"
          ></textarea>
        </div>
        
        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading">Enviando...</span>
          <span v-else class="flex-center">
            <Send :size="18" /> Enviar Report
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { ArrowLeft, Send } from 'lucide-vue-next';

const description = ref('');
const isLoading = ref(false);
const router = useRouter();
const toast = useToast();

const handleSubmit = async () => {
  if (!description.value.trim()) {
    toast.warning('Por favor, descreva o problema antes de enviar.');
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      description: description.value,
      // Enviamos a URL da página atual para dar mais contexto ao report
      pageUrl: window.location.href 
    };
    const response = await api.post('/bugs', payload);
    
    toast.success(response.data.message);
    // Após o sucesso, envia o usuário de volta para a página anterior
    router.back();

  } catch (err) {
    toast.error(err.response?.data?.error || 'Não foi possível enviar o report.');
    console.error('Falha no report:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.report-container {
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
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  text-align: center;
}
.instructions {
  margin-bottom: 1.5rem;
  color: var(--cor-texto-suave);
  line-height: 1.6;
  text-align: center;
}
textarea {
  resize: vertical;
}
.btn-primary {
  width: 100%;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.btn-primary:disabled {
  background-color: var(--cor-texto-suave);
  border-bottom-color: var(--cor-texto-suave);
  cursor: not-allowed;
}
</style>