<template>
  <div class="login-container">
    <h1>Entrar</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Usuário</label>
        <input id="username" type="text" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
      <button type="submit" class="btn-primary">Entrar</button>
    </form>
    <p class="register-link">
      Ainda não tem uma conta? <RouterLink to="/register">Cadastre-se</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Variáveis reativas para os campos do formulário e mensagens de erro
const username = ref('');
const password = ref('');
const error = ref(null);

// Instanciando o router e o nosso store de autenticação
const router = useRouter();
const authStore = useAuthStore();

// Função que é chamada quando o formulário é enviado
const handleLogin = async () => {
  error.value = null; // Limpa erros antigos
  try {
    await authStore.login(username.value, password.value);
    // Se o login for bem-sucedido, redireciona para a página principal
    router.push('/');
  } catch (err) {
    // Se o login falhar, mostra uma mensagem de erro
    error.value = 'Usuário ou senha inválidos. Tente novamente.';
    console.error('Falha no login:', err);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding-top: 2rem;
}

h1 {
  color: var(--cor-destaque);
  font-size: 2rem;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

input {
  padding: 0.8rem;
  background-color: var(--cor-fundo-secundaria);
  border: 1px solid var(--cor-texto);
  border-radius: 5px;
  color: var(--cor-texto);
  font-size: 1rem;
}

input:focus {
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
  margin-top: 1rem;
}

.error-message {
  color: var(--cor-erro);
  text-align: center;
}

.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>