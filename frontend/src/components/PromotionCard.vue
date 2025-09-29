<template>
  <div class="card promo-card">
    <img :src="promo.imagem_url" :alt="promo.titulo" class="promo-image" />
    <div class="promo-text">
      <h2 class="promo-title">{{ promo.titulo }}</h2>
      <p v-if="promo.descricao" class="promo-description">
        {{ displayText }}
      </p>
      <div class="card-actions">
        <button v-if="isTruncated" @click="isExpanded = !isExpanded" class="btn-link">
          {{ isExpanded ? 'Ler Menos' : 'Ler Mais' }}
        </button>
        <a 
          v-if="promo.link_url" 
          :href="promo.link_url" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-primary btn-saiba-mais"
        >
          Saiba Mais
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  promo: {
    type: Object,
    required: true,
  },
});

const isExpanded = ref(false);
const TRUNCATE_LENGTH = 120;

const isTruncated = computed(() => {
  return props.promo.descricao && props.promo.descricao.length > TRUNCATE_LENGTH;
});

const displayText = computed(() => {
  if (!props.promo.descricao) return '';
  if (isExpanded.value || !isTruncated.value) {
    return props.promo.descricao;
  }
  return props.promo.descricao.substring(0, TRUNCATE_LENGTH) + '...';
});
</script>

<style scoped>
.promo-card {
  padding: 0;
  overflow: hidden;
}
.promo-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.promo-text {
  padding: 1rem 1.5rem;
}
.promo-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--cor-texto);
}
.promo-description {
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
  line-height: 1.6;
}
.card-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-link {
  background: none;
  border: none;
  color: var(--cor-secundaria);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
}

.btn-saiba-mais {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  border-bottom-width: 3px;
}
.btn-saiba-mais:active {
  transform: translateY(1px);
  border-bottom-width: 2px;
}
</style>