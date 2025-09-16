<template>
  <div class="accept-policy-wrapper">
    <div class="card policy-container">
      <h1 class="page-title">
        <ShieldCheck :size="28" />
        Política de Privacidade
      </h1>
      <p class="instructions">
        Para usar o Stud+, você precisa ler e aceitar nossos termos e a política de privacidade.
      </p>

      <div class="policy-content-wrapper">
        <PrivacyPolicyContent />
      </div>

      <div class="actions">
        <button @click="handleDecline" class="btn-secondary">Recusar e Sair</button>
        <button @click="handleAccept" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Aceitar e Continuar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { ShieldCheck } from 'lucide-vue-next';
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent.vue';
import logoUrl from '@/assets/stud_blue.png';

const isLoading = ref(false);
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const handleAccept = async () => {
  isLoading.value = true;
  try {
    await api.post('/usuarios/me/accept-policy');
    toast.success('Política de privacidade aceita com sucesso!');
    authStore.setPolicyAccepted();
    router.push({ name: 'home' });
  } catch (err) {
    toast.error('Não foi possível salvar sua resposta. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const handleDecline = () => {
  toast.info('Você foi desconectado.');
  authStore.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.accept-policy-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background-color: var(--cor-fundo);
}
.policy-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}
.logo {
  height: 80px;
  margin-bottom: 1.5rem;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--cor-secundaria);
}
.instructions {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--cor-texto-suave);
  font-size: 0.9rem;
}
.policy-content-wrapper {
  max-height: 40vh;
  overflow-y: auto;
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-secondary {
  order: 2;
  background: none;
  border: none;
  color: var(--cor-texto-suave);
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}
.btn-secondary:hover {
  color: var(--cor-erro);
}

.btn-primary {
  order: 1;
}
</style>