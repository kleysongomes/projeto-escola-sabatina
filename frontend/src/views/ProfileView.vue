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
          <ul>
            <li><strong>País:</strong> {{ profileData.pais }}</li>
            <li><strong>Estado:</strong> {{ profileData.estado }}</li>
            <li><strong>Cidade:</strong> {{ profileData.cidade }}</li>
            <li><strong>Igreja:</strong> {{ profileData.igreja_nome || 'Não informada' }}</li>
          </ul>
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

const activeTab = ref('details');
const profileData = ref(null);
const myReviews = ref(null);
const likedReviews = ref(null);

const isLoadingProfile = ref(true);
const isLoadingMyReviews = ref(false);
const isLoadingLikedReviews = ref(false);

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

onMounted(() => {
  fetchProfileData();
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
.details-section ul { list-style: none; padding: 0; }
.details-section li { padding: 0.5rem 0; color: var(--cor-texto-suave); }
.details-section strong { color: var(--cor-texto); font-weight: 700; }
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
</style>