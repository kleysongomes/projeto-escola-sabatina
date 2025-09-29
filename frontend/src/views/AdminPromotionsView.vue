<template>
  <div class="admin-container">
    <div class="header-nav">
      <h1 class="page-title">
        <LayoutPanelLeft :size="28" />
        Gerenciar Propagandas
      </h1>
      <RouterLink to="/admin/propagandas/nova" class="btn-primary btn-new">
        <Plus :size="20" />
        <span>Criar Nova</span>
      </RouterLink>
    </div>

    <div v-if="isLoading" class="loading">Carregando propagandas...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="promotions.length > 0" class="promo-list">
      <div v-for="promo in promotions" :key="promo.id" class="card promo-item">
        <img :src="promo.imagem_url" :alt="promo.titulo" class="promo-thumbnail" />
        <div class="promo-info">
          <span class="promo-title">{{ promo.titulo }}</span>
          <span class="promo-description">{{ promo.descricao || 'Sem descrição' }}</span>
        </div>
        <div class="promo-actions">
          <RouterLink :to="`/admin/propagandas/editar/${promo.id}`" class="action-btn edit-btn">
            <Edit :size="18" />
          </RouterLink>
          <button @click="handleDelete(promo.id)" class="action-btn delete-btn">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
      Nenhuma propaganda criada ainda. Clique em "Criar Nova" para começar.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { LayoutPanelLeft, Plus, Edit, Trash2 } from 'lucide-vue-next';

const promotions = ref([]);
const isLoading = ref(true);
const error = ref(null);
const router = useRouter();
const toast = useToast();

const fetchAllPromotions = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/propagandas/all');
    promotions.value = response.data;
  } catch (err) {
    error.value = "Não foi possível carregar as propagandas.";
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (promoId) => {
  if (confirm('Tem certeza que deseja deletar esta propaganda?')) {
    try {
      await api.delete(`/propagandas/${promoId}`);
      toast.success('Propaganda deletada com sucesso!');
      promotions.value = promotions.value.filter(p => p.id !== promoId);
    } catch (err) {
      toast.error('Não foi possível deletar a propaganda.');
    }
  }
};

onMounted(() => {
  fetchAllPromotions();
});
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.btn-new {
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.loading, .error-message, .no-data {
  text-align: center;
  margin-top: 4rem;
  color: var(--cor-texto-suave);
}
.promo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.promo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.promo-thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--cor-borda);
  flex-shrink: 0;
}
.promo-info {
  flex-grow: 1;
  min-width: 0;
}
.promo-title {
  font-weight: 700;
  white-space: normal;
  word-break: break-word;
}
.promo-description {
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  /* CORREÇÃO ADICIONADA: Propriedade padrão para maior compatibilidade */
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.promo-actions {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  background: var(--cor-fundo);
  border: 1px solid var(--cor-borda);
  color: var(--cor-texto-suave);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
}
.edit-btn:hover {
  color: var(--cor-primaria);
  border-color: var(--cor-primaria);
}
.delete-btn:hover {
  color: var(--cor-erro);
  border-color: var(--cor-erro);
}
</style>