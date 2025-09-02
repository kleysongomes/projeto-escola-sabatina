<template>
  <div class="about-container">
    <div class="header-nav">
      <h1 class="page-title">Sobre o App</h1>
    </div>

    <RouterLink to="/reportar-bug" class="banner-report-bug">
      <div class="banner-content">
        <Bug :size="20" />
        <span>Encontrou um problema? Nos ajude a melhorar!</span>
      </div>
      <ChevronRight :size="24" />
    </RouterLink>

    <div class="card info-card">
      <h2 class="section-title"><Info :size="20" /> Sobre o Projeto</h2>
      <p>
        Este aplicativo foi criado para incentivar o estudo diário da Lição da Escola Sabatina Jovem de uma forma mais interativa e gamificada. O objetivo é criar uma comunidade de estudantes engajados, compartilhando aprendizados e crescendo juntos na fé.
      </p>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><Award :size="20" /> Como Funciona a Pontuação</h2>
      <p>A pontuação é calculada com base em dois critérios principais:</p>
      <ul>
        <li><strong>Pontos por Horário:</strong> Quanto mais cedo você estuda e envia sua review, mais pontos ganha!
          <ul>
            <li>04:00 - 06:00: <strong>100 pts</strong></li>
            <li>06:01 - 12:00: <strong>75 pts</strong></li>
            <li>12:01 - 18:00: <strong>50 pts</strong></li>
            <li>Depois das 18:01: <strong>25 pts</strong></li>
            <li>De madrugada (00:01 - 04:00): <strong>10 pts</strong></li>
          </ul>
        </li>
        <li><strong>Pontos por Conteúdo:</strong> Reviews mais detalhadas ganham mais pontos (até 50 pts por conteúdo).</li>
      </ul>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><GitBranch :size="20" /> Versão</h2>
      <p>Você está usando a versão: <strong>{{ appVersion }}</strong></p>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><PartyPopper  :size="20" /> O que há de novo </h2>
      <ul>
        <li><strong>NOVO</strong>: Curtir Review.</li>
        <li><strong>NOVO</strong>: Reportar Review.</li>
        <li><strong>NOVO</strong>: Reportar BUGs.</li>
        <li><strong>NOVO</strong>: Cadastro por Igreja</li>
        <li><strong>NOVO</strong>: Filtro no Ranking</li>
        <li><strong>NOVO</strong>: Inclusão de Banner</li>
        <li><strong>NOVO</strong>: Detalhes de pontuação</li>
        <li><strong>Bug Corrigido</strong>: Remover review(Moderadores)</li>
      </ul>
      
      <a 
        href="https://github.com/kleysongomes/projeto-escola-sabatina/issues?q=is%3Aissue+state%3Aclosed" 
        target="_blank" 
        rel="noopener noreferrer"
        class="documentation-link"
      >
        Ver documentação de entregas
      </a>
    </div>

    <div class="card info-card">
      <h2 class="section-title"><UserCircle :size="20" /> Do criador</h2>
      <p>
        Olá, meu nome é <strong>Kleyson Gomes</strong>, e tenho dedicado tempo e empenho nesse projeto, espero que goste!.
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
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { version } from '../../package.json';
// 2. Ícone de 'Award' (prêmio) adicionado à importação
import { Info, GitBranch, UserCircle, Heart, HeartHandshake, PartyPopper, Bug, ChevronRight, Award } from 'lucide-vue-next'; 
import VueQrcode from 'vue-qrcode';
import { useToast } from 'vue-toastification';

const router = useRouter();
const appVersion = version;
const toast = useToast();
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
/* Nenhum estilo novo precisou ser adicionado, pois reutilizamos os existentes! */
/* Os estilos abaixo são os que você já tinha no arquivo. */
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

.info-card ul ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}
.info-card strong {
  color: var(--cor-texto);
  font-weight: 700;
}
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
.banner-report-bug {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid #fef3c7;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s;
}
.banner-report-bug:hover {
  background-color: #fef3c7;
}
.banner-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.documentation-link {
  display: block;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
  text-decoration: underline;
}
.documentation-link:hover {
  color: var(--cor-secundaria);
}
</style>