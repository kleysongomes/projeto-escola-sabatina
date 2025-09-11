# Stud+ - Frontend

Este é o frontend para a aplicação de Reviews da Lição da Escola Sabatina. É uma Single Page Application (SPA) construída com Vue.js (Vue 3), utilizando Vite como ferramenta de build. A aplicação é focada em uma experiência mobile-first, gamificada e instalável (PWA).

## ✨ Funcionalidades

-   **Interface Reativa:** Construída com o ecossistema moderno do Vue 3 (Composition API e `<script setup>`).
-   **Gamificação Completa:** Sistema de pontos por horário e conteúdo, com um Ranking de usuários dinâmico e filtrável.
-   **Perfil de Usuário:** Tela dedicada onde o usuário pode ver seus dados, suas reviews escritas e as reviews que curtiu.
-   **Interações Sociais:** Usuários podem curtir, compartilhar (via Web Share API) e reportar reviews de outros membros.
-   **Sistema de Cadastro Inteligente:** Com verificação de nome de usuário em tempo real e uma lista de igrejas dinâmica que permite a criação de novas igrejas pelo próprio usuário.
-   **Funções de Administrador:** Permissões especiais para administradores, como a capacidade de deletar qualquer review.
-   **Progressive Web App (PWA):** O app é instalável na tela de início de dispositivos móveis, funciona offline e abre em modo de tela cheia para uma experiência imersiva.
-   **Sistema de Feedback:** Inclui uma tela para reportar bugs e um sistema de notificações "toast" para dar feedback claro sobre as ações do usuário.
-   **Roteamento e Estado:** Navegação gerenciada pelo `Vue Router` com rotas protegidas e gerenciamento de estado de autenticação centralizado com `Pinia`, incluindo renovação automática de sessão com Access/Refresh Tokens.

## 🛠️ Tecnologias Utilizadas

-   **Framework Principal:** Vue.js (Vue 3) com Vite
-   **Roteamento:** Vue Router
-   **Gerenciamento de Estado:** Pinia
-   **Chamadas HTTP:** Axios
-   **Qualidade de Código:** ESLint e Prettier

#### Bibliotecas Principais
-   `vite-plugin-pwa`: Para todas as funcionalidades de Progressive Web App.
-   `vue-toastification`: Para as notificações e alertas.
-   `lucide-vue-next`: Para a iconografia moderna.
-   `vue-qrcode`: Para a geração do QR Code do PIX.
-   `jwt-decode`: Para decodificar os tokens de autenticação no frontend.

## ⚙️ Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 20 ou superior)
-   O **servidor do backend** deve estar rodando para que a aplicação funcione.

## 🚀 Instalação e Execução

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd frontend
    ```

2.  **Crie o Arquivo de Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env.local` na raiz da pasta `frontend`.
    * Cole o conteúdo abaixo nele. Este arquivo informa ao app Vue onde encontrar o backend.
    ```ini
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

3.  **Instale as Dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    * O servidor geralmente roda em `http://localhost:5173`. A URL exata será exibida no seu terminal.

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Hot-Reload.
-   `npm run build`: Compila a aplicação para produção (gera a pasta `dist`).
-   `npm run preview`: Pré-visualiza a build de produção localmente.
-   `npm run lint`: Executa o linter para verificar a qualidade do código.
