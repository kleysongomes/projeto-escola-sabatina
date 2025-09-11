# Stud+ - Backend

Este é o serviço de backend para a aplicação Stud+. É uma API RESTful construída com Node.js e Express, conectada a um banco de dados PostgreSQL e projetada para ser executada em um ambiente containerizado com Docker.

## ✨ Funcionalidades

-   **Autenticação Robusta:** Sistema de **Access Tokens** (curta duração) e **Refresh Tokens** (longa duração) para manter o usuário logado de forma segura e contínua.
-   **Sistema de Permissões:** Distinção entre usuários normais e **Administradores**, com rotas e lógicas específicas para cada um.
-   **Gamificação:** Sistema de pontos calculado no servidor com base no horário de envio e no tamanho da review.
-   **Interações Sociais:** Endpoints para **curtir/descurtir**, **reportar** e (para admins) **deletar** reviews, com a devida atualização dos pontos do usuário.
-   **Gerenciamento de Dados:**
    -   Rotas para **listar e criar igrejas** de forma dinâmica.
    -   Rotas para o **perfil do usuário**, permitindo buscar dados cadastrais, reviews escritas e reviews curtidas.
    -   Endpoint para **report de bugs**.
-   **Validação e Padronização:** Validação de dados na entrada e padronização de campos de texto (país, cidade, etc.) para manter a consistência do banco de dados.
-   **Banco de Dados Automatizado:** Um script `init.sql` garante que todo o esquema do banco de dados (incluindo todas as tabelas e relações) seja criado automaticamente em um novo ambiente.

## 🛠️ Tecnologias Utilizadas

-   **Node.js** com **Express.js**
-   **PostgreSQL**
-   **Docker** e **Docker Compose**
-   **Bibliotecas Principais:** `pg` (PostgreSQL Driver), `jsonwebtoken`, `bcryptjs`, `cors`, `axios`, `dotenv`.

## ⚙️ Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 20 ou superior)
-   [Docker](https://www.docker.com/products/docker-desktop/)

## 🚀 Instalação e Execução Local

1.  **Clone o repositório** e navegue até a pasta do projeto.

2.  **Inicie o Banco de Dados:** A partir da pasta raiz do projeto, use o `docker-compose.yml` de desenvolvimento para subir o banco:
    ```bash
    docker compose up -d
    ```

3.  **Configure o Backend:**
    * Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
    * Instale as dependências:
    ```bash
    npm install
    ```

4.  **Crie o Arquivo de Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na pasta `backend`.
    * Cole o conteúdo abaixo. **É crucial usar segredos fortes e aleatórios.**
    ```ini
    # Credenciais do banco de dados local (correspondem ao docker-compose.yml)
    DB_USER=admin
    DB_PASSWORD=password
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=sabbath_school_reviews

    # Chaves secretas para os tokens JWT
    ACCESS_TOKEN_SECRET=seu_segredo_curto_e_aleatorio_aqui
    REFRESH_TOKEN_SECRET=seu_segredo_MUITO_MAIS_LONGO_e_diferente_aqui

    # Duração dos tokens
    ACCESS_TOKEN_EXPIRATION="15m"
    REFRESH_TOKEN_EXPIRATION="30d"
    ```

5.  **Inicie o Servidor:**
    ```bash
    npm run dev
    ```
    * O servidor estará rodando em `http://localhost:3000`.

## 📖 Endpoints da API

### Autenticação (`/api/auth`)
| Método | Rota       | Protegida | Descrição                     |
| :----- | :--------- | :-------- | :------------------------------ |
| `POST` | `/refresh` | Não       | Renova um Access Token expirado. |

### Usuários (`/api/usuarios`)
| Método | Rota               | Protegida | Descrição                                    |
| :----- | :----------------- | :-------- | :------------------------------------------- |
| `POST` | `/register`        | Não       | Registra um novo usuário.                    |
| `POST` | `/login`           | Não       | Autentica um usuário e retorna os tokens.      |
| `POST` | `/logout`          | **Sim** | Invalida o Refresh Token do usuário no banco.  |
| `POST` | `/check-username`  | Não       | Verifica se um nome de usuário está disponível. |
| `GET`  | `/ranking`         | **Sim** | Lista o ranking de usuários (paginado e com filtros). |
| `GET`  | `/me`              | **Sim** | Busca os dados do perfil do usuário logado.    |
| `GET`  | `/me/reviews`      | **Sim** | Lista as reviews escritas pelo usuário logado. |
| `GET`  | `/me/likes`        | **Sim** | Lista as reviews curtidas pelo usuário logado. |

### Lições (`/api/lessons`)
| Método | Rota     | Protegida | Descrição                     |
| :----- | :------- | :-------- | :------------------------------ |
| `GET`  | `/today` | **Sim** | Busca os dados da lição do dia. |

### Reviews (`/api/reviews`)
| Método   | Rota       | Protegida | Descrição                               |
| :------- | :--------- | :-------- | :-------------------------------------- |
| `GET`    | `/`        | **Sim** | Lista todas as reviews (paginado).      |
| `POST`   | `/`        | **Sim** | Submete uma nova review.                |
| `DELETE` | `/:id`     | **Admin** | Deleta uma review específica.           |
| `POST`   | `/:id/like`  | **Sim** | Curte ou descurte uma review.         |
| `POST`   | `/:id/report`| **Sim** | Reporta uma review.                   |

### Igrejas (`/api/igrejas`)
| Método | Rota | Protegida | Descrição                     |
| :----- | :--- | :-------- | :------------------------------ |
| `GET`  | `/`  | Não       | Lista todas as igrejas. |
| `POST` | `/`  | Não       | Cria uma nova igreja. |
