<template>
  <div class="form-container">
    <div class="header-nav">
      <button @click="router.back()" class="back-btn" aria-label="Voltar">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">
        {{ isEditing ? 'Editar Propaganda' : 'Criar Propaganda' }}
      </h1>
    </div>

    <div v-if="isLoading" class="loading">Carregando...</div>
    <div v-else class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="titulo">Título (obrigatório)</label>
          <input id="titulo" type="text" v-model="formData.titulo" required class="input-field" />
        </div>
        <div class="form-group">
          <label for="imagem_url">URL da Imagem (obrigatório)</label>
          <input id="imagem_url" type="url" v-model="formData.imagem_url" required class="input-field" placeholder="https://exemplo.com/imagem.png" />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="formData.descricao" rows="4" class="input-field"></textarea>
        </div>
        <div class="form-group">
          <label for="link_url">Link de Destino</label>
          <input id="link_url" type="url" v-model="formData.link_url" class="input-field" placeholder="https://exemplo.com" />
        </div>

        <hr class="divider" />
        <h2 class="form-subtitle">Segmentação (opcional)</h2>
        <p class="instructions">Deixe em branco para exibir para todos os usuários.</p>
        
        <div class="form-group">
          <label for="target_pais">País</label>
          <input id="target_pais" type="text" v-model="formData.target_pais" class="input-field" />
        </div>
        <div class="form-group">
          <label for="target_estado">Estado</label>
          <input id="target_estado" type="text" v-model="formData.target_estado" class="input-field" />
        </div>
        <div class="form-group">
          <label for="target_cidade">Cidade</label>
          <input id="target_cidade" type="text" v-model="formData.target_cidade" class="input-field" />
        </div>
        <div class="form-group">
          <label for="target_igreja_id">Igreja Específica</label>
          <select id="target_igreja_id" v-model="formData.target_igreja_id" class="input-field">
            <option :value="null">Todas as Igrejas</option>
            <option v-for="igreja in igrejas" :key="igreja.id" :value="igreja.id">
              {{ igreja.nome }}
            </option>
          </select>
        </div>
      
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Propaganda') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { ArrowLeft } from 'lucide-vue-next';

const formData = ref({
  titulo: '',
  descricao: '',
  imagem_url: '',
  link_url: '',
  target_pais: '',
  target_estado: '',
  target_cidade: '',
  target_igreja_id: null,
});
const igrejas = ref([]);

const isLoading = ref(true);
const isSubmitting = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEditing = computed(() => !!route.params.id);
const promoId = route.params.id;

onMounted(async () => {
  isLoading.value = true;
  try {
    const igrejasResponse = await api.get('/igrejas');
    igrejas.value = igrejasResponse.data;

    if (isEditing.value) {
      const promoResponse = await api.get(`/propagandas/${promoId}`);
      formData.value = promoResponse.data;
    }
  } catch (err) {
    toast.error("Não foi possível carregar os dados.");
    router.back();
  } finally {
    isLoading.value = false;
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await api.put(`/propagandas/${promoId}`, formData.value);
      toast.success('Propaganda atualizada com sucesso!');
    } else {
      await api.post('/propagandas', formData.value);
      toast.success('Propaganda criada com sucesso!');
    }
    router.push({ name: 'admin-promotions' });
  } catch (err) {
    toast.error(err.response?.data?.error || 'Ocorreu um erro ao salvar.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
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
}
.back-btn {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: var(--cor-texto);
  cursor: pointer;
}
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.loading {
  text-align: center;
  margin-top: 4rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  text-align: left;
}
label {
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 0.9rem;
}
.btn-primary {
  width: 100%;
  margin-top: 1rem;
}
.btn-primary:disabled {
  background-color: var(--cor-texto-suave);
  border-bottom-color: var(--cor-texto-suave);
  cursor: not-allowed;
}
.divider {
  border: none;
  border-top: 1px solid var(--cor-borda);
  margin: 1rem 0;
}
.form-subtitle {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--cor-texto);
  text-align: center;
  margin-bottom: 0.5rem;
}
.instructions {
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
  text-align: center;
  margin-bottom: 1rem;
}
</style>