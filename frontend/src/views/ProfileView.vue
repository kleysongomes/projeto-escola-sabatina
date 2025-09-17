<template>
  <div class="profile-container">
    <div v-if="isLoadingProfile" class="loading">Carregando perfil...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="profileData" class="profile-content">
      <div class="profile-header card">
        <RouterLink to="/configuracoes" class="settings-btn" aria-label="Configurações">
          <Settings :size="22" />
        </RouterLink>

        <UserCircle2 :size="60" class="profile-icon" />
        <h1 class="username">{{ profileData.usuario }}</h1>
        <p class="member-since">Membro desde: {{ formatDate(profileData.data_criacao, true) }}</p>
        <div class="stats">
          <div class="stat-item">
            <strong>{{ profileData.pontos_totais }}</strong>
            <span>Pontos</span>
          </div>
        </div>
      </div>

      <nav class="tabs">
        <button @click="activeTab = 'details'" :class="{ active: activeTab === 'details' }">Dados</button>
        <button @click="activeTab = 'myReviews'" :class="{ active: activeTab === 'myReviews' }">Reviews</button>
        <button @click="activeTab = 'likedReviews'" :class="{ active: activeTab === 'likedReviews' }">Curtidas</button>
      </nav>

      <div class="tab-content">
        <div v-if="activeTab === 'details'" class="details-section card">
          <div class="profile-details-list">
            <div class="detail-item">
              <span class="detail-label">País</span>
              <span class="detail-value">{{ profileData.pais }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado</span>
              <span class="detail-value">{{ profileData.estado }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cidade</span>
              <span class="detail-value">{{ profileData.cidade }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Igreja</span>
              <span class="detail-value">{{ profileData.igreja_nome || 'Não informada' }}</span>
            </div>
          </div>

          <hr class="divider" />
          
          <h3 class="chart-title">Pontos nos Últimos 7 Dias</h3>
          
          <div v-if="isLoadingChart" class="loading-chart">Carregando gráfico...</div>
          <div v-else-if="!pointsHistory || pointsHistory.length === 0" class="no-data">Não há dados de pontos para exibir.</div>
          <div v-else>
            <PointsChart :historyData="pointsHistory" />
          </div>
        </div>

        <div v-if="activeTab === 'myReviews'">
          <div v-if="isLoadingMyReviews" class="loading">Carregando...</div>
          <div v-else-if="myReviews && myReviews.reviews.length > 0">
            <div class="reviews-list">
              <div class="card review-item" v-for="review in myReviews.reviews" :key="review.id">
                <p>"{{ review.conteudo }}"</p>
                <small>{{ formatDate(review.data_criacao) }}</small>
              </div>
            </div>
          </div>
          <div v-else class="no-data">Você ainda não escreveu nenhuma review.</div>
        </div>

        <div v-if="activeTab === 'likedReviews'">
          <div v-if="isLoadingLikedReviews" class="loading">Carregando...</div>
          <div v-else-if="likedReviews && likedReviews.reviews.length > 0">
             <div class="reviews-list">
              <div class="card review-item" v-for="review in likedReviews.reviews" :key="review.id">
                <p>"{{ review.conteudo }}"</p>
                <small>Por: {{ review.usuario }} em {{ formatDate(review.data_criacao) }}</small>
              </div>
            </div>
          </div>
          <div v-else class="no-data">Você ainda não curtiu nenhuma review.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/services/api';
import { UserCircle2, Settings } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import PointsChart from '@/components/PointsChart.vue';

const activeTab = ref('details');
const profileData = ref(null);
const myReviews = ref(null);
const likedReviews = ref(null);
const pointsHistory = ref(null);
const isLoadingProfile = ref(true);
const isLoadingMyReviews = ref(false);
const isLoadingLikedReviews = ref(false);
const isLoadingChart = ref(true);
const error = ref(null);
const toast = useToast();

const formatDate = (isoString, dateOnly = false) => {
  if (!isoString) return '';
  const options = dateOnly 
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoString).toLocaleString('pt-BR', options);
};

const fetchProfileData = async () => {
  try {
    const response = await api.get('/usuarios/me');
    profileData.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar os dados do perfil.';
    toast.error(error.value);
  } finally {
    isLoadingProfile.value = false;
  }
};

const fetchMyReviews = async (page = 1) => {
  isLoadingMyReviews.value = true;
  try {
    const response = await api.get(`/usuarios/me/reviews?page=${page}`);
    myReviews.value = response.data;
  } catch (err) {
    toast.error('Não foi possível carregar suas reviews.');
  } finally {
    isLoadingMyReviews.value = false;
  }
};

const fetchLikedReviews = async (page = 1) => {
  isLoadingLikedReviews.value = true;
  try {
    const response = await api.get(`/usuarios/me/likes?page=${page}`);
    likedReviews.value = response.data;
  } catch (err) {
    toast.error('Não foi possível carregar suas reviews curtidas.');
  } finally {
    isLoadingLikedReviews.value = false;
  }
};

const fetchPointsHistory = async () => {
  isLoadingChart.value = true;
  try {
    const response = await api.get('/usuarios/me/points-history');
    pointsHistory.value = response.data;
  } catch (err) {
    console.error('Não foi possível carregar o histórico de pontos.', err);
    pointsHistory.value = null; 
  } finally {
    isLoadingChart.value = false;
  }
};

onMounted(() => {
  fetchProfileData();
  fetchPointsHistory();
});

watch(activeTab, (newTab) => {
  if (newTab === 'myReviews' && !myReviews.value) {
    fetchMyReviews();
  } else if (newTab === 'likedReviews' && !likedReviews.value) {
    fetchLikedReviews();
  }
});
</script>

<style scoped>
.profile-container { display: flex; flex-direction: column; gap: 1.5rem; }
.loading, .error-message, .no-data { text-align: center; margin-top: 2rem; }
.no-data { color: var(--cor-texto-suave); }
.profile-header { 
  text-align: center; 
  padding: 2rem 1rem; 
  position: relative;
}
.profile-icon { color: var(--cor-secundaria); margin-bottom: 0.5rem; }
.username { font-size: 1.8rem; font-weight: 900; }
.member-since { font-size: 0.9rem; color: var(--cor-texto-suave); margin-bottom: 1.5rem; }
.stats { display: flex; justify-content: center; gap: 2rem; }
.stat-item { display: flex; flex-direction: column; }
.stat-item strong { font-size: 1.5rem; font-weight: 900; }
.stat-item span { font-size: 0.8rem; color: var(--cor-texto-suave); }
.tabs {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid var(--cor-borda);
}
.tabs button {
  background: none;
  border: none;
  padding: 1rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--cor-texto-suave);
  cursor: pointer;
  position: relative;
  border-bottom: 3px solid transparent;
}
.tabs button.active {
  color: var(--cor-secundaria);
  border-bottom-color: var(--cor-secundaria);
}
.tab-content { margin-top: 1.5rem; }
.reviews-list { display: flex; flex-direction: column; gap: 1rem; }
.review-item { padding: 1rem; }
.review-item p { font-style: italic; margin-bottom: 0.5rem; }
.review-item small { color: var(--cor-texto-suave); font-size: 0.8rem; }
.settings-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--cor-texto-suave);
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.settings-btn:hover {
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
}
.profile-details-list {
  display: flex;
  flex-direction: column;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--cor-fundo);
}
.detail-item:last-child {
  border-bottom: none;
}
.detail-label {
  font-weight: 600;
  color: var(--cor-texto-suave);
}
.detail-value {
  font-weight: 600;
  color: var(--cor-texto);
}
.divider {
  border: none;
  border-top: 1px solid var(--cor-borda);
  margin: 1.5rem 0;
}
.chart-title {
  text-align: center;
  font-weight: 700;
  color: var(--cor-texto-suave);
  margin-bottom: 1rem;
}
.loading-chart {
  text-align: center;
  padding: 2rem;
  color: var(--cor-texto-suave);
}
</style>