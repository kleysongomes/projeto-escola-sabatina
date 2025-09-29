<template>
  <div class="discover-container">
    <div class="header-nav">
      <h1 class="page-title">
        Descubra
      </h1>
    </div>

    <div v-if="isLoading" class="loading">Carregando...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="promotions.length > 0" class="promotions-list">
      <PromotionCard 
        v-for="promo in promotions" 
        :key="promo.id"
        :promo="promo"
      />
    </div>
    
    <div v-else class="no-data">
      Não há nada novo para descobrir no momento. Volte mais tarde!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import PromotionCard from '@/components/PromotionCard.vue';

const promotions = ref([]);
const isLoading = ref(true);
const error = ref(null);
const toast = useToast();

onMounted(async () => {
  try {
    const response = await api.get('/propagandas');
    promotions.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar o conteúdo.';
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.discover-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.header-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.loading, .error-message, .no-data {
  text-align: center;
  margin-top: 4rem;
  color: var(--cor-texto-suave);
}
.promotions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>