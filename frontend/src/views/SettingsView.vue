<template>
  <div class="settings-container">
    <div class="header-nav">
      <button @click="router.back()" class="back-btn" aria-label="Voltar">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">
        <Settings :size="28" />
        Configurações
      </h1>
    </div>

    <div class="settings-list">
      <div class="card setting-item">
        <div class="item-icon-wrapper">
          <Palette :size="24" />
        </div>
        <div class="item-content">
          <span class="item-title">Tema da Aplicação</span>
          <span class="item-description">
            Atualmente: <strong>{{ authStore.user?.tema === 'dark' ? 'Escuro' : 'Claro' }}</strong>
          </span>
        </div>
        <div class="theme-switch-wrapper">
          <label class="theme-switch" for="theme-checkbox">
            <input type="checkbox" id="theme-checkbox" :checked="authStore.user?.tema === 'dark'" @change="toggleTheme" />
            <div class="slider round"></div>
          </label>
        </div>
      </div>

      <div class="card setting-item disabled">
        <div class="item-icon-wrapper">
          <User :size="24" />
        </div>
        <div class="item-content">
          <span class="item-title">Alterar Dados Cadastrais</span>
          <span class="item-description">Atualize seu nome de usuário, local, etc (em breve).</span>
        </div>
        <ChevronRight :size="24" class="item-chevron" />
      </div>

      <div class="card setting-item disabled">
        <div class="item-icon-wrapper">
          <Lock :size="24" />
        </div>
        <div class="item-content">
          <span class="item-title">Alterar Senha</span>
          <span class="item-description">Mantenha sua conta segura (em breve).</span>
        </div>
        <ChevronRight :size="24" class="item-chevron" />
      </div>

      <button @click="isPolicyModalOpen = true" class="card setting-item">
        <div class="item-icon-wrapper">
          <ShieldCheck :size="24" />
        </div>
        <div class="item-content">
          <span class="item-title">Política de Privacidade</span>
          <span class="item-description">Veja os termos e condições de uso do app.</span>
        </div>
        <ChevronRight :size="24" class="item-chevron" />
      </button>
    </div>
  </div>

  <BaseModal :show="isPolicyModalOpen" @close="isPolicyModalOpen = false">
    <template #header>
      <ShieldCheck :size="24" />
      Política de Privacidade
    </template>
    <template #body>
      <PrivacyPolicyContent />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Settings, ArrowLeft, Palette, User, Lock, ShieldCheck, ChevronRight } from 'lucide-vue-next';
import BaseModal from '@/components/BaseModal.vue';
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const isPolicyModalOpen = ref(false);
const authStore = useAuthStore();

const toggleTheme = () => {
  const newTheme = authStore.user?.tema === 'dark' ? 'light' : 'dark';
  authStore.updateTheme(newTheme);
};
</script>

<style scoped>
.settings-container {
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
  color: var(--cor-texto);
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
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  text-align: left;
  border: 1px solid var(--cor-borda);
  background-color: var(--cor-container);
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
}
.setting-item:hover {
  background-color: var(--cor-fundo);
}
.item-icon-wrapper {
  background-color: #e0f2fe;
  color: var(--cor-secundaria);
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-content {
  flex-grow: 1;
}
.item-title {
  font-weight: 700;
  color: var(--cor-texto);
}
.item-description {
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
  display: block;
}
.item-chevron {
  color: var(--cor-texto-suave);
  opacity: 0.5;
}
.setting-item.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.setting-item.disabled:hover {
  background-color: var(--cor-container);
}
.theme-switch-wrapper {
  position: relative;
}
.theme-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--cor-borda);
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}
input:checked + .slider {
  background-color: var(--cor-primaria);
}
input:focus + .slider {
  box-shadow: 0 0 1px var(--cor-primaria);
}
input:checked + .slider:before {
  transform: translateX(22px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
:deep(.modal-header) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>