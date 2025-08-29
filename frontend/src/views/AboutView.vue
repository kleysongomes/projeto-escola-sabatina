<template>
  <div class="about-container">
    <div class="header-nav">
      <h1 class="page-title">Sobre o App</h1>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><Info :size="20" /> Sobre o Projeto</h2>
      <p>
        Este aplicativo foi criado para incentivar o estudo diário da Lição da Escola Sabatina Jovem de uma forma mais interativa e gamificada. O objetivo é criar uma comunidade de estudantes engajados, compartilhando aprendizados e crescendo juntos na fé.
      </p>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><GitBranch :size="20" /> Versão</h2>
      <p>Você está usando a versão: <strong>{{ appVersion }} - TESTE</strong></p>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><UserCircle :size="20" /> Do criador</h2>
      <p>
        Olá, meu nome é <strong>Kleyson Gomes</strong>, e tenho dedicado tempo e empenho nesse projeto, espero que goste!
        </p>
    </div>
    
    <div class="card info-card">
      <h2 class="section-title"><Heart :size="20" /> Agradecimentos</h2>
      <ul>
        <li>A Adventech por fornecer a API gratuita da Lição da Escola Sabatina.</li>
        <li>Aos testadores: luanaa, Makel, Frankllin </li>
      </ul>
    </div>

    <div class="card info-card support-card">
      <h2 class="section-title"><HeartHandshake :size="20" /> Apoie este Projeto</h2>
      <p>
        Se este aplicativo tem sido uma bênção para você, considere fazer uma doação de qualquer valor via PIX para ajudar a manter o projeto no ar e em constante desenvolvimento.
      </p>
      <div class="qrcode-container">
        <VueQrcode 
          :value="pixKey" 
          :options="{ width: 200 }"
        />
      </div>
      <button @click="copyPixKey" class="btn-primary btn-copy-pix">
        Copiar Chave PIX
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // Importar o ref
import { useRouter } from 'vue-router';
import { version } from '../../package.json';
import { Info, GitBranch, UserCircle, Heart, HeartHandshake } from 'lucide-vue-next';

// 2. IMPORTAÇÕES PARA A NOVA FUNCIONALIDADE
import VueQrcode from 'vue-qrcode';
import { useToast } from 'vue-toastification';

const router = useRouter();
const appVersion = version;
const toast = useToast();

// 3. CHAVE PIX E FUNÇÃO DE COPIAR
const pixKey = ref('00020101021126580014br.gov.bcb.pix01366a880e48-561d-41c1-b376-5e9e10712bc35204000053039865802BR5918KLEYSON DE O GOMES6007MACAIBA62070503***63046B14');

const copyPixKey = async () => {
  try {
    await navigator.clipboard.writeText(pixKey.value);
    toast.success('Chave PIX copiada para a área de transferência!');
  } catch (err) {
    toast.error('Não foi possível copiar a chave.');
    console.error('Falha ao copiar:', err);
  }
};
</script>

<style scoped>
.about-container {
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
.page-title {
  font-weight: 900;
  font-size: 1.5rem;
}
.info-card {
  padding: 1.5rem;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--cor-secundaria);
}
.info-card p, .info-card li {
  color: var(--cor-texto-suave);
  line-height: 1.7;
}
.info-card ul {
  padding-left: 1.5rem;
}
.info-card strong {
  color: var(--cor-texto);
  font-weight: 700;
}

/* 4. NOVOS ESTILOS PARA A SEÇÃO DE APOIO */
.support-card {
  text-align: center;
}
.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}
.btn-copy-pix {
  width: 100%;
  max-width: 250px;
}
</style>