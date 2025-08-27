# Review da Lição - Frontend

Este é o frontend para a aplicação de Reviews da Lição da Escola Sabatina. É uma Single Page Application (SPA) construída com Vue.js (Vue 3), utilizando Vite como ferramenta de build. A aplicação é focada em uma experiência mobile-first.

## ✨ Funcionalidades

-   **Interface Reativa:** Construída com o ecossistema moderno do Vue 3 (Composition API).
-   **Roteamento:** Navegação entre telas (Login, Cadastro, Home, Ranking, Reviews) gerenciada pelo `Vue Router`.
-   **Gerenciamento de Estado:** O estado de autenticação do usuário é gerenciado de forma centralizada com o `Pinia`.
-   **Persistência de Login:** O usuário permanece logado mesmo que a página seja recarregada, graças ao `localStorage`.
-   **Rotas Protegidas:** O acesso às telas principais é bloqueado para usuários não autenticados.
-   **Componentização:** A aplicação é dividida em componentes reutilizáveis e visões de página.
-   **Design Mobile-First:** O layout e os estilos são pensados primariamente para dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

-   **Vue.js (Vue 3)**
-   **Vite**
-   **Vue Router**
-   **Pinia**
-   **Axios**
-   **ESLint** e **Prettier** para qualidade e formatação de código.

## ⚙️ Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   O **servidor do backend** deve estar rodando para que a aplicação funcione.

## 🚀 Instalação e Execução

1.  **Clone o repositório** (caso ainda não tenha feito):
    ```bash
    git clone <url-do-seu-repositorio>
    cd projeto-escola-sabatina
    ```

2.  **Configure o Frontend:**
    * Navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```
    * Instale as dependências:
    ```bash
    npm install
    ```

3.  **Crie o Arquivo de Variáveis de Ambiente:**
    * Na raiz da pasta `frontend`, crie um arquivo chamado `.env.local`.
    * Copie e cole o conteúdo abaixo nele. Este arquivo informa ao nosso app Vue onde encontrar o backend.
    ```ini
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

4.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    * O servidor de desenvolvimento do Vite geralmente roda em `http://localhost:5173`. A URL exata será exibida no seu terminal.

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Hot-Reload.
-   `npm run build`: Compila a aplicação para produção.
-   `npm run preview`: Pré-visualiza a build de produção localmente.
-   `npm run lint`: Executa o linter para verificar a qualidade do código.