<template>
  <div class="auth-container">
    <img :src="logoUrl" alt="Stud+ Logo" class="logo" />
    
    <h1 class="title">Comece sua jornada!</h1>
    
    <div class="card">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input id="username" type="text" v-model.trim="formData.usuario" required class="input-field"/>
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
      
        <button type="submit" class="btn-primary" :disabled="isLoading">
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
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import logoUrl from '@/assets/stud_blue.png';

const formData = ref({
  usuario: '', senha: '', pais: '', estado: '', cidade: ''
});
const isLoading = ref(false);
const router = useRouter();
const toast = useToast();

const handleRegister = async () => {
  isLoading.value = true;
  try {
    await api.post('/usuarios/register', formData.value);
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

.logo {
  height: 120px;
  margin-bottom: -25px;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 1.8rem;
  font-weight: 900;
  margin-top: 0;
  margin-bottom: 1.5rem;
}


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
</style>