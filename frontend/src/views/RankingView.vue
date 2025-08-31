<template>
  <div>
    <h1 class="title">Ranking de Estudantes</h1>

    <div class="toggle-filters-wrapper">
      <button @click="toggleFilters" class="btn-toggle-filters">
        <Filter :size="16" />
        <span>Filtrar Ranking</span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="showFilters" class="card filters-card">
        <div class="filters-form">
          <div class="form-group">
            <label for="pais">País</label>
            <input id="pais" type="text" v-model="filters.pais" class="input-field" placeholder="Brasil" />
          </div>
          <div class="form-group">
            <label for="estado">Estado</label>
            <input id="estado" type="text" v-model="filters.estado" class="input-field" placeholder="RN" />
          </div>
          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input id="cidade" type="text" v-model="filters.cidade" class="input-field" placeholder="Natal" />
          </div>
          <div class="form-group">
            <label for="igreja">Igreja</label>
            <select id="igreja" v-model="filters.igreja_id" class="input-field">
              <option value="">Todas</option>
              <option v-for="igreja in igrejas" :key="igreja.id" :value="igreja.id">
                {{ igreja.nome }}
              </option>
            </select>
          </div>
        </div>
        <div class="filters-actions">
          <button @click="clearFilters" class="btn-filter btn-secondary">Limpar</button>
          <button @click="applyFilters" class="btn-filter btn-primary">Filtrar</button>
        </div>
      </div>
    </transition>

    <div v-if="isLoading" class="loading">Carregando ranking...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="rankingData && rankingData.ranking.length > 0">
      <div class="card ranking-card">
        <ol class="ranking-list">
          <li v-for="(user, index) in rankingData.ranking" :key="user.id" :class="{ 'current-user': user.id === authStore.user?.id }">
            <span class="rank-position">#{{ (rankingData.currentPage - 1) * 10 + index + 1 }}</span>
            
            <div class="user-info">
              <div class="user-main-info">
                <span class="username">{{ user.usuario }}</span>
                <span class="points">{{ user.pontos_totais }} pts</span>
              </div>
              <div class="user-sub-info">
                <span class="location">{{ user.cidade }}, {{ user.pais }}</span>
                <span v-if="user.igreja_nome" class="church-name">{{ user.igreja_nome }}</span>
              </div>
            </div>
            
          </li>
        </ol>
      </div>
      <div class="pagination">
        <button @click="changePage(rankingData.currentPage - 1)" :disabled="rankingData.currentPage <= 1">Anterior</button>
        <span>Página {{ rankingData.currentPage }} de {{ rankingData.totalPages }}</span>
        <button @click="changePage(rankingData.currentPage + 1)" :disabled="rankingData.currentPage >= rankingData.totalPages">Próximo</button>
      </div>
    </div>
    <div v-else class="no-data">Nenhum resultado encontrado para este filtro.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { Filter } from 'lucide-vue-next';

const rankingData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const filters = ref({
  pais: route.query.pais || '',
  estado: route.query.estado || '',
  cidade: route.query.cidade || '',
  igreja_id: route.query.igreja_id || '',
});
const igrejas = ref([]);
const showFilters = ref(false);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const fetchIgrejas = async () => {
  try {
    const response = await api.get('/igrejas');
    igrejas.value = response.data;
  } catch (err) {
    console.error("Não foi possível carregar a lista de igrejas para o filtro.");
  }
};

const fetchRanking = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams(route.query);
    const response = await api.get(`/usuarios/ranking?${params.toString()}`);
    rankingData.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar o ranking.';
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  const activeFilters = {};
  for (const key in filters.value) {
    if (filters.value[key]) {
      activeFilters[key] = filters.value[key];
    }
  }
  router.push({ query: { ...activeFilters, page: 1 } });
};

const clearFilters = () => {
  filters.value = { pais: '', estado: '', cidade: '', igreja_id: '' };
  router.push({ name: 'ranking' });
};

const changePage = (page) => {
  if (rankingData.value && page > 0 && page <= rankingData.value.totalPages) {
    router.push({ query: { ...route.query, page } });
  }
};

onMounted(() => {
  fetchIgrejas();
  fetchRanking();
});

watch(() => route.query, () => {
  filters.value.pais = route.query.pais || '';
  filters.value.estado = route.query.estado || '';
  filters.value.cidade = route.query.cidade || '';
  filters.value.igreja_id = route.query.igreja_id || '';
  fetchRanking();
}, { deep: true });
</script>

<style scoped>
.title { text-align: center; font-weight: 900; margin-bottom: 1rem; color: var(--cor-texto); }
.loading, .no-data, .error-message { text-align: center; margin-top: 2rem; }
.ranking-card { padding: 0.5rem 1rem; margin-top: 1.5rem; }
.ranking-list { list-style: none; padding: 0; }
.ranking-list li { 
  display: flex; 
  align-items: flex-start;
  padding: 1rem 0.5rem; 
  border-bottom: 1px solid var(--cor-borda); 
}
.ranking-list li:last-child { border-bottom: none; }
.rank-position { 
  font-size: 1.2rem; 
  font-weight: 900; 
  color: var(--cor-texto-suave); 
  min-width: 45px; 
  padding-top: 0.25rem;
}
.user-info { 
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
}
.user-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.username { font-weight: 700; font-size: 1.1rem; }
.points { font-weight: 900; font-size: 1.1rem; color: var(--cor-secundaria); }

.user-sub-info {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem; 
  color: var(--cor-texto-suave);
  margin-top: 0.25rem;
}
.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
.pagination span { color: var(--cor-texto-suave); font-weight: 700; }
.pagination button {
  background-color: var(--cor-container);
  border: 2px solid var(--cor-borda);
  color: var(--cor-texto-suave);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ranking-list li.current-user {
  background-color: #e0f2fe;
  border: 2px solid var(--cor-secundaria);
  border-radius: 8px;
  margin: 0 -0.5rem;
  padding: 1rem;
}
.current-user .username {
  color: var(--cor-secundaria);
}
.toggle-filters-wrapper {
  text-align: center;
  margin-bottom: 1.5rem;
}
.btn-toggle-filters {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  background: none;
  border: none;
  color: var(--cor-texto-suave);
  cursor: pointer;
  padding: 0.5rem;
}
.btn-toggle-filters:hover {
  color: var(--cor-secundaria);
}
.filters-card {
  margin-bottom: 2rem;
  padding: 1rem;
  border-top: 4px solid var(--cor-secundaria);
}
.filters-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--cor-texto-suave);
  margin-bottom: 0.25rem;
}
.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--cor-borda);
}
.btn-filter {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.btn-filter.btn-primary {
  background-color: var(--cor-primaria);
  border-color: var(--cor-primaria);
  color: white;
}
.btn-filter.btn-primary:hover {
  background-color: var(--cor-primaria-hover);
  border-color: var(--cor-primaria-hover);
}
.btn-filter.btn-secondary {
  background-color: var(--cor-container);
  border-color: var(--cor-borda);
  color: var(--cor-texto-suave);
}
.btn-filter.btn-secondary:hover {
  background-color: var(--cor-fundo);
  border-color: var(--cor-texto-suave);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0px;
}
</style>