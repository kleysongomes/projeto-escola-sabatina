<template>
  <div class="change-password-container">
    <div class="header-nav">
      <button @click="router.back()" class="back-btn" aria-label="Voltar">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">
        Alterar Senha
      </h1>
    </div>

    <div class="card">
      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label for="current-password">Senha Atual</label>
          <input 
            id="current-password" 
            type="password" 
            v-model="currentPassword" 
            required 
            class="input-field"
          />
        </div>
        
        <div class="form-group">
          <label for="new-password">Nova Senha</label>
          <input 
            id="new-password" 
            type="password" 
            v-model="newPassword" 
            required 
            class="input-field"
            placeholder="Mínimo de 6 caracteres"
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirmar Nova Senha</label>
          <input 
            id="confirm-password" 
            type="password" 
            v-model="confirmPassword" 
            required 
            class="input-field"
          />
        </div>
      
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : 'Alterar Senha' }}
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
import { useAuthStore } from '@/stores/auth';
import { ArrowLeft } from 'lucide-vue-next';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const handleChangePassword = async () => {
  // Validações no frontend primeiro
  if (newPassword.value !== confirmPassword.value) {
    toast.error('A nova senha e a confirmação não são idênticas.');
    return;
  }
  if (newPassword.value.length < 6) {
    toast.error('A nova senha deve ter pelo menos 6 caracteres.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    };
    const response = await api.post('/usuarios/me/change-password', payload);
    
    toast.success(response.data.message);

    // Desloga o usuário por segurança
    await authStore.logout();
    // Redireciona para a tela de login
    router.push({ name: 'login' });

  } catch (err) {
    toast.error(err.response?.data?.error || 'Não foi possível alterar a senha.');
    console.error('Falha na alteração de senha:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Estilos consistentes com as outras telas de formulário */
.change-password-container {
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
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  text-align: left;
}
label {
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
}
.btn-primary {
  width: 100%;
  margin-top: 1rem;
}
.btn-primary:disabled {
  background-color: var(--cor-texto-suave);
  border-bottom-color: var(--cor-texto-suave);
  cursor: not-allowed;
}
</style>