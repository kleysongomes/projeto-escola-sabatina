<template>
  <div class="register-container">
    <h1>Criar Conta</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Usuário</label>
        <input id="username" type="text" v-model="formData.usuario" required />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="formData.senha" required />
      </div>
       <div class="form-group">
        <label for="pais">País</label>
        <input id="pais" type="text" v-model="formData.pais" required />
      </div>
       <div class="form-group">
        <label for="estado">Estado</label>
        <input id="estado" type="text" v-model="formData.estado" required />
      </div>
       <div class="form-group">
        <label for="cidade">Cidade</label>
        <input id="cidade" type="text" v-model="formData.cidade" required />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      
      <button type="submit" class="btn-primary">Cadastrar</button>
    </form>
    <p class="login-link">
      Já tem uma conta? <RouterLink to="/login">Faça o login</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import api from '@/services/api';

const formData = ref({
  usuario: '',
  senha: '',
  pais: '',
  estado: '',
  cidade: ''
});
const error = ref(null);
const successMessage = ref(null);
const router = useRouter();

const handleRegister = async () => {
  error.value = null;
  successMessage.value = null;
  try {
    await api.post('/usuarios/register', formData.value);
    successMessage.value = 'Cadastro realizado com sucesso! Redirecionando para o login...';
    
    // Redireciona para o login após 2 segundos
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
/* Estilos são praticamente idênticos aos da tela de login */
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1rem;
}
h1 { color: var(--cor-destaque); font-size: 2rem; }
form { width: 100%; display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
label { margin-bottom: 0.5rem; font-size: 0.9rem; }
input { padding: 0.8rem; background-color: var(--cor-fundo-secundaria); border: 1px solid var(--cor-texto); border-radius: 5px; color: var(--cor-texto); font-size: 1rem; }
input:focus { outline: none; border-color: var(--cor-primaria); }
.btn-primary { padding: 0.9rem; background-color: var(--cor-primaria); color: var(--cor-fundo); border: none; border-radius: 5px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; }
.error-message { color: var(--cor-erro); text-align: center; }
.success-message { color: var(--cor-sucesso); text-align: center; }
.login-link { margin-top: 1rem; font-size: 0.9rem; }
</style>