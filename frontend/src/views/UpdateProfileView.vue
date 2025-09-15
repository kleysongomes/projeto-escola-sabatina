<template>
  <div class="update-profile-container">
    <div class="header-nav">
      <button @click="router.back()" class="back-btn" aria-label="Voltar">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">
        Editar Perfil
      </h1>
    </div>

    <div v-if="isLoading" class="loading">Carregando seus dados...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="card">
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input 
            id="username" 
            type="text" 
            v-model.trim="formData.usuario" 
            @blur="validateUsername"
            required 
            class="input-field"
          />
          <small v-if="usernameError" class="validation-error">{{ usernameError }}</small>
        </div>
        
        <div class="form-group">
          <label for="pais">País</label>
          <input id="pais" type="text" v-model.trim="formData.pais" required class="input-field"/>
        </div>
        <div class="form-group">
          <label for="estado">Estado</label>
          <input id="estado" type="text" v-model.trim="formData.estado" required class="input-field"/>
        </div>
        <div class="form-group">
          <label for="cidade">Cidade</label>
          <input id="cidade" type="text" v-model.trim="formData.cidade" required class="input-field"/>
        </div>

        <div class="form-group">
          <label for="igreja">Igreja</label>
          <select id="igreja" v-model="formData.igreja_id" required class="input-field">
            <option disabled value="">Selecione uma igreja</option>
            <option v-for="igreja in igrejas" :key="igreja.id" :value="igreja.id">
              {{ igreja.nome }}
            </option>
          </select>
        </div>
      
        <button type="submit" class="btn-primary" :disabled="isSubmitting || !!usernameError">
          {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { ArrowLeft } from 'lucide-vue-next';

const formData = ref({
  usuario: '',
  pais: '',
  estado: '',
  cidade: '',
  igreja_id: '',
});
const originalUsername = ref('');
const igrejas = ref([]);

const isLoading = ref(true);
const isSubmitting = ref(false);
const usernameError = ref('');

const router = useRouter();
const toast = useToast();

onMounted(async () => {
  try {
    const [profileResponse, igrejasResponse] = await Promise.all([
      api.get('/usuarios/me'),
      api.get('/igrejas')
    ]);
    
    const profile = profileResponse.data;
    formData.value = {
      usuario: profile.usuario,
      pais: profile.pais,
      estado: profile.estado,
      cidade: profile.cidade,
      // AQUI ESTÁ A CORREÇÃO DEFINITIVA: Convertendo o ID para String
      igreja_id: String(profile.igreja_id || ''), 
    };
    originalUsername.value = profile.usuario;
    igrejas.value = igrejasResponse.data;

  } catch (err) {
    error.value = "Não foi possível carregar os dados para edição.";
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
});

const validateUsername = async () => {
  if (!formData.value.usuario) {
    usernameError.value = '';
    return;
  }
  if (formData.value.usuario === originalUsername.value) {
    usernameError.value = '';
    return;
  }
  try {
    const response = await api.post('/usuarios/check-username', { usuario: formData.value.usuario });
    usernameError.value = response.data.available ? '' : 'Este nome de usuário já está em uso.';
  } catch (err) {
    console.error('Erro ao verificar usuário:', err);
  }
};

const handleUpdate = async () => {
  await validateUsername();
  if (usernameError.value) {
    toast.error('Por favor, corrija os erros no formulário.');
    return;
  }

  isSubmitting.value = true;
  try {
    await api.patch('/usuarios/me', formData.value);
    toast.success('Perfil atualizado com sucesso!');
    router.back();
  } catch (err) {
    toast.error(err.response?.data?.error || 'Não foi possível atualizar o perfil.');
    console.error('Falha na atualização:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.update-profile-container {
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
.loading, .error-message {
  text-align: center;
  margin-top: 2rem;
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
.validation-error {
  color: var(--cor-erro);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>