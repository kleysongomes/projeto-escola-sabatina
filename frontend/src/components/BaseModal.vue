<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <header class="modal-header">
            <slot name="header">Título Padrão</slot>
            <button @click="close" class="close-button" aria-label="Fechar modal">
              <X :size="24" />
            </button>
          </header>
          <section class="modal-body">
            <slot name="body">
              Conteúdo padrão do corpo.
            </slot>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next';

// Define as propriedades que o componente aceita
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

// Define os eventos que o componente pode emitir
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: var(--cor-container);
  padding: 1.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--cor-borda);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cor-texto-suave);
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  line-height: 1.7;
  color: var(--cor-texto-suave);
}

/* Animações de Fade para o Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>