<template>
  <div class="policy-container card">
    <div class="header-nav">
      <button v-if="!isForcedAcceptance" @click="router.back()" class="back-btn" aria-label="Voltar">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">
        <ShieldCheck :size="28" />
        Política de Privacidade
      </h1>
    </div>

    <div class="policy-content">
      <h2>1. Coleta de Dados</h2>
      <p>Coletamos as informações que você nos fornece diretamente no momento do cadastro, como nome de usuário, senha (armazenada de forma segura com hash), país, estado, cidade e igreja. Também coletamos as reviews que você escreve e suas interações (curtidas, reports).</p>

      <h2>2. Uso das Informações</h2>
      <p>As informações coletadas são usadas para o funcionamento da plataforma, incluindo o sistema de gamificação (pontos e ranking), exibição das reviews para a comunidade e moderação de conteúdo. Seu nome de usuário, cidade, país e igreja são visíveis publicamente no ranking.</p>
      
      <h2>3. Segurança dos Dados</h2>
      <p>Nos comprometemos a proteger seus dados. Senhas são criptografadas com `bcrypt` e nunca armazenadas em texto puro. A comunicação entre o aplicativo e o servidor é protegida com HTTPS/SSL.</p>

      </div>

    <div v-if="isForcedAcceptance" class="actions">
      <p>Para continuar a usar o Stud+, você precisa aceitar nossa Política de Privacidade.</p>
      <div class="action-buttons">
        <button @click="handleDecline" class="btn-secondary">Recusar e Sair</button>
        <button @click="handleAccept" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Aceitar e Continuar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { ArrowLeft, ShieldCheck } from 'lucide-vue-next';

const isLoading = ref(false);
const isForcedAcceptance = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

onMounted(() => {
  isForcedAcceptance.value = route.query.force === 'true';
});

const handleAccept = async () => {
  isLoading.value = true;
  try {
    await api.post('/usuarios/me/accept-policy');
    toast.success('Política de privacidade aceita!');
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
.policy-container {
  padding: 1.5rem;
}
.header-nav {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-bottom: 2rem;
  color: var(--cor-secundaria);
}
.back-btn {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: var(--cor-texto);
  cursor: pointer;
  padding: 0.5rem;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.policy-content {
  max-height: 50vh; /* Altura máxima para o texto */
  overflow-y: auto; /* Adiciona scroll se o texto for muito grande */
  padding-right: 1rem; /* Espaço para a barra de scroll */
}
.policy-content h2 {
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--cor-texto);
}
.policy-content p {
  color: var(--cor-texto-suave);
  line-height: 1.7;
}

.actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--cor-borda);
  text-align: center;
}
.actions p {
  color: var(--cor-texto-suave);
  margin-bottom: 1rem;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>