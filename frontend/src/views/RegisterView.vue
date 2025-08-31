<template>
  <div class="auth-container">
    <img :src="logoUrl" alt="Stud+ Logo" class="logo" />
    
    <h1 class="title">Comece sua jornada!</h1>
    
    <div class="card">
      <form @submit.prevent="handleRegister">
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
          <label for="password">Senha</label>
          <input id="password" type="password" v-model="formData.senha" required class="input-field"/>
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

        <div v-if="formData.igreja_id === 'new'" class="form-group">
          <label for="nova-igreja">Nome da Nova Igreja</label>
          <input id="nova-igreja" type="text" v-model.trim="novaIgrejaNome" class="input-field" placeholder="Ex: IASD Central"/>
        </div>
      
        <button type="submit" class="btn-primary" :disabled="isLoading || !!usernameError">
          {{ isLoading ? 'Cadastrando...' : 'Criar conta' }}
        </button>
      </form>
    </div>

    <p class="switch-link">
      Já tem uma conta? <RouterLink :to="{ name: 'login' }">Entrar</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; 
import { useRouter, RouterLink } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import logoUrl from '@/assets/stud_blue.png';

const formData = ref({
  usuario: '',
  senha: '',
  pais: '',
  estado: '',
  cidade: '',
  igreja_id: '', 
});
const isLoading = ref(false);
const router = useRouter();
const toast = useToast();
const igrejas = ref([]);
const novaIgrejaNome = ref('');
const usernameError = ref('');

onMounted(async () => {
  try {
    const response = await api.get('/igrejas');
    igrejas.value = response.data;
    igrejas.value.unshift({ id: 'new', nome: 'Outra (adicionar nova)...' });
  } catch (error) {
    toast.error('Não foi possível carregar a lista de igrejas.');
  }
});

const validateUsername = async () => {
  if (!formData.value.usuario) {
    usernameError.value = '';
    return;
  }
  try {
    const response = await api.post('/usuarios/check-username', { usuario: formData.value.usuario });
    if (!response.data.available) {
      usernameError.value = 'Este nome de usuário já está em uso.';
    } else {
      usernameError.value = '';
    }
  } catch (err) {
    console.error('Erro ao verificar usuário:', err);
    usernameError.value = 'Não foi possível verificar o usuário.';
  }
};

const handleRegister = async () => {
  await validateUsername(); // Garante que a validação foi feita uma última vez
  if (usernameError.value) {
    toast.error('Por favor, corrija os erros no formulário.');
    return;
  }

  isLoading.value = true;
  const registrationPayload = { ...formData.value };

  try {
    if (registrationPayload.igreja_id === 'new') {
      if (!novaIgrejaNome.value) {
        toast.error('Por favor, digite o nome da nova igreja.');
        isLoading.value = false;
        return;
      }
      
      const novaIgrejaResponse = await api.post('/igrejas', {
        nome: novaIgrejaNome.value,
        cidade: registrationPayload.cidade,
        estado: registrationPayload.estado,
        pais: registrationPayload.pais,
      });
      
      registrationPayload.igreja_id = novaIgrejaResponse.data.id;
    }

    await api.post('/usuarios/register', registrationPayload);
    toast.success('Cadastro realizado com sucesso!');
    
    setTimeout(() => {
      router.push('/login');
    }, 1500);

  } catch (err) {
    toast.error(err.response?.data?.error || 'Não foi possível realizar o cadastro.');
    console.error('Falha no cadastro:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container { text-align: center; padding-top: 1rem; }
.logo { height: 120px; margin-bottom: -25px; position: relative; z-index: 1; }
.title { font-size: 1.8rem; font-weight: 900; margin-top: 0; margin-bottom: 1.5rem; }
.card { margin-bottom: 1.5rem; }
form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { text-align: left; }
label { font-weight: 700; margin-bottom: 0.5rem; display: block; }
.switch-link a { color: var(--cor-primaria); font-weight: 700; }
.btn-primary:disabled {
  background-color: var(--cor-texto-suave);
  border-bottom-color: var(--cor-texto-suave);
  cursor: not-allowed;
}
#nova-igreja {
  margin-top: -0.5rem;
}
.validation-error {
  color: var(--cor-erro);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>