<template>
  <div class="auth-container">
    <h1 class="title">Comece sua jornada!</h1>
    
    <div class="card">
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input id="username" type="text" v-model="formData.usuario" required class="input-field"/>
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input id="password" type="password" v-model="formData.senha" required class="input-field"/>
        </div>
        <div class="form-group">
          <label for="pais">País</label>
          <input id="pais" type="text" v-model="formData.pais" required class="input-field"/>
        </div>
        <div class="form-group">
          <label for="estado">Estado</label>
          <input id="estado" type="text" v-model="formData.estado" required class="input-field"/>
        </div>
        <div class="form-group">
          <label for="cidade">Cidade</label>
          <input id="cidade" type="text" v-model="formData.cidade" required class="input-field"/>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      
        <button type="submit" class="btn-primary">Criar conta</button>
      </form>
    </div>

    <p class="switch-link">
      Já tem uma conta? <RouterLink :to="{ name: 'login' }">Entrar</RouterLink>
    </p>
  </div>
</template>

<script setup>
// O SCRIPT SETUP CONTINUA IGUAL!
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import api from '@/services/api';

const formData = ref({
  usuario: '', senha: '', pais: '', estado: '', cidade: ''
});
const error = ref(null);
const successMessage = ref(null);
const router = useRouter();

const handleRegister = async () => {
  error.value = null;
  successMessage.value = null;
  try {
    await api.post('/usuarios/register', formData.value);
    successMessage.value = 'Cadastro realizado! Redirecionando...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.error || 'Não foi possível realizar o cadastro.';
    console.error('Falha no cadastro:', err);
  }
};
</script>

<style scoped>
/* ESTILOS IDÊNTICOS AOS DO LOGIN VIEW */
.auth-container { text-align: center; padding-top: 1rem; }
.title { font-size: 1.8rem; font-weight: 900; margin-bottom: 2rem; }
.card { margin-bottom: 1.5rem; }
form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { text-align: left; }
label { font-weight: 700; margin-bottom: 0.5rem; display: block; }
.error-message { color: var(--cor-erro); margin: 1rem 0; }
.success-message { color: var(--cor-primaria); margin: 1rem 0; }
.switch-link a { color: var(--cor-primaria); font-weight: 700; }
</style>