<template>
  <div class="auth-container">
    <img :src="logoUrl" alt="Stud+ Logo" class="logo" />

    <h1 class="title">Bem-vindo de volta!</h1>
    
    <div class="card">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input id="username" type="text" v-model="username" required class="input-field" />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input id="password" type="password" v-model="password" required class="input-field" />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button type="submit" class="btn-primary">Entrar</button>
      </form>
    </div>

    <p class="switch-link">
      Não tem uma conta? <RouterLink :to="{ name: 'register' }">Crie uma</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import logoUrl from '@/assets/stud_blue.png';

const username = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  error.value = null;
  try {
    await authStore.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = 'Usuário ou senha inválidos. Tente novamente.';
    console.error('Falha no login:', err);
  }
};
</script>

<style scoped>
.auth-container {
  text-align: center;
  padding-top: 2rem;
}


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


.card {
  margin-bottom: 1.5rem;
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
.error-message {
  color: var(--cor-erro);
  margin: 1rem 0;
}
.switch-link a {
  color: var(--cor-primaria);
  font-weight: 700;
}
</style>