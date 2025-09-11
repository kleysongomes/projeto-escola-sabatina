# Stud+ \| Check-in da Lição

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Um aplicativo de gamificação para o estudo diário da Lição da Escola
Sabatina Jovem, focado em criar uma comunidade engajada através de
reviews e interações.

## 📖 Sobre o Projeto

O Stud+ foi criado para ser um parceiro no estudo diário da Lição da
Escola Sabatina. A plataforma permite que os usuários façam um
"check-in" diário, escrevam uma breve reflexão sobre o aprendizado, e
ganhem pontos com base no horário e na qualidade da sua review. O
objetivo é transformar o hábito do estudo em uma jornada interativa e
comunitária.

## ✨ Funcionalidades Principais

-   **Gamificação do Estudo:** Sistema de pontos que incentiva o estudo
    nos primeiros horários do dia.
-   **Ranking de Usuários:** Tabela de classificação que pode ser
    filtrada por país, estado, cidade e igreja.
-   **Mural de Reviews:** Um feed com as reflexões mais recentes de
    todos os usuários.
-   **Interações Sociais:** Usuários podem curtir, compartilhar e
    reportar reviews.
-   **Moderação e Segurança:** Sistema de permissões de Administrador
    para gerenciamento de conteúdo.
-   **Progressive Web App (PWA):** O aplicativo pode ser instalado na
    tela de início de dispositivos móveis para uma experiência nativa.
-   **Cadastro Dinâmico de Igrejas:** Os usuários podem selecionar sua
    igreja de uma lista ou adicionar uma nova durante o cadastro.
-   **Feedback de Usuário:** Funcionalidade para reportar bugs e
    sugestões.

## 🛠️ Tecnologias Utilizadas

#### **Backend**

-   **Node.js** com **Express.js** para a API RESTful.
-   **PostgreSQL** como banco de dados.
-   **Docker** e **Docker Compose** para orquestração dos serviços.
-   **JWT (JSON Web Tokens)** para autenticação com sistema de
    Access/Refresh Tokens.
-   **Bcrypt.js** para hashing seguro de senhas.

#### **Frontend**

-   **Vue.js (Vue 3)** com a Composition API e `<script setup>`.
-   **Vite** como ferramenta de build.
-   **Vue Router** para o roteamento de páginas.
-   **Pinia** para gerenciamento de estado global.
-   **Axios** para as chamadas à API.
-   **Lucide Icons** para a iconografia.

## 📂 Estrutura do Repositório

Este é um monorepo que contém as duas aplicações principais:

├── backend/ \# Aplicação Node.js (API) 

├── frontend/ \# AplicaçãoVue.js (Interface do Usuário) 

└── ...

Para detalhes específicos de cada parte, consulte os arquivos
`README.md` dentro de cada pasta.

## 🚀 Guia de Instalação e Execução Local

Siga estes passos para ter a aplicação completa rodando na sua máquina.

#### **1. Pré-requisitos**

-   [Node.js](https://nodejs.org/) (versão 20 ou superior)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### **2. Clonar o Repositório**

``` bash
git clone https://github.com/kleysongomes/projeto-escola-sabatina.git
cd projeto-escola-sabatina
```

#### **3. Configuração do Banco de Dados (Docker)**

Na raiz do projeto, crie um arquivo chamado docker-compose.yml e cole o
seguinte conteúdo:

``` yaml
# Arquivo: docker-compose.yml (para desenvolvimento local)
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: sabbath_school_reviews
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
volumes:
  postgres_data_dev:
```

Depois, inicie o container do banco de dados:

``` bash
docker compose up -d
```

#### **4. Configurar e Rodar o Backend**

``` bash
cd backend
```

Crie um arquivo `.env` na pasta backend com o seguinte conteúdo:

``` ini
# --- Arquivo: backend/.env ---

# Banco de Dados Local
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=sabbath_school_reviews

# Chaves para Tokens (use geradores de senha online para criar as suas)
ACCESS_TOKEN_SECRET=segredo_para_o_access_token
REFRESH_TOKEN_SECRET=segredo_diferente_e_mais_longo_para_o_refresh_token
ACCESS_TOKEN_EXPIRATION="15m"
REFRESH_TOKEN_EXPIRATION="30d"
```

Instale as dependências e inicie o servidor do backend:

``` bash
npm install
npm run dev
```

#### **5. Configurar e Rodar o Frontend**

Abra um novo terminal:

``` bash
cd frontend
```

Crie um arquivo `.env.local` na pasta frontend com o seguinte conteúdo:

``` ini
# --- Arquivo: frontend/.env.local ---
VITE_API_BASE_URL=http://localhost:3000/api
```

Instale as dependências e inicie o servidor de desenvolvimento:

``` bash
npm install
npm run dev
```

#### **6. Pronto!**

Sua aplicação agora está totalmente funcional para desenvolvimento
local.

-   **Frontend** estará acessível em: http://localhost:5173\
-   **Backend (API)** estará acessível em: http://localhost:3000

------------------------------------------------------------------------

## ☁️ Deploy em Produção

A aplicação é projetada para ser publicada em um Servidor Virtual
Privado (VPS) usando Docker.\
O arquivo `docker-compose.prod.yml` orquestra os containers do banco de
dados, backend, frontend (com Nginx) e um reverse proxy (Caddy) para
HTTPS automático.
