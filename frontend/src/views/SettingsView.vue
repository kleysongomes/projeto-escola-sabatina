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

const router = useRouter();
const isPolicyModalOpen = ref(false);
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
:deep(.modal-header) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>