# Stud+ - Backend

Este é o serviço de backend para a aplicação de Reviews da Lição da Escola Sabatina. É uma API RESTful construída com Node.js e Express, conectada a um banco de dados PostgreSQL.

## ✨ Funcionalidades

-   **Autenticação de Usuários:** Cadastro e Login com JSON Web Tokens (JWT).
-   **Segurança:** Senhas são armazenadas de forma segura usando hashing com `bcryptjs`.
-   **Gamificação:** Um sistema de pontos é calculado no servidor com base no horário e no conteúdo das reviews.
-   **Regras de Negócio:** Limita o envio de reviews para uma por usuário por dia.
-   **API Externa:** Consome a API da Adventech para buscar dinamicamente a lição do dia.
-   **Paginação:** As rotas de listagem (ranking e reviews) são paginadas para melhor performance.
-   **Banco de Dados Automatizado:** As tabelas são criadas automaticamente na inicialização do servidor.

## 🛠️ Tecnologias Utilizadas

-   **Node.js**
-   **Express.js**
-   **PostgreSQL**
-   **Docker** e **Docker Compose**
-   **Bibliotecas Principais:** `pg` (PostgreSQL Driver), `jsonwebtoken`, `bcryptjs`, `cors`, `axios`.

## ⚙️ Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   [Docker](https://www.docker.com/products/docker-desktop/)

## 🚀 Instalação e Execução

1.  **Clone o repositório** (caso ainda não tenha feito):
    ```bash
    git clone <url-do-seu-repositorio>
    cd projeto-escola-sabatina
    ```

2.  **Inicie o Banco de Dados com Docker:**
    * A partir da pasta raiz do projeto (`projeto-escola-sabatina`), execute:
    ```bash
    docker-compose up -d
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
    * Crie um arquivo chamado `.env` na raiz da pasta `backend`.
    * Copie e cole o conteúdo abaixo nele:
    ```ini
    # Credenciais do banco de dados (devem ser as mesmas do docker-compose.yml)
    DB_USER=admin
    DB_PASSWORD=supersecretpassword
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=sabbath_school_reviews

    # Chave secreta para assinar os JWTs
    JWT_SECRET=este_e_um_segredo_muito_longo_e_dificil_de_adivinhar_12345
    ```

5.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    * O servidor estará rodando em `http://localhost:3000`.

## Endpoints da API

| Método | Rota                     | Protegida | Descrição                               | Corpo da Requisição (Exemplo)                                    |
| :----- | :----------------------- | :-------- | :-------------------------------------- | :--------------------------------------------------------------- |
| `POST` | `/api/usuarios/register` | Não       | Registra um novo usuário.               | `{ "usuario": "...", "senha": "...", "pais": "...", ... }`        |
| `POST` | `/api/usuarios/login`    | Não       | Autentica um usuário e retorna um token.  | `{ "usuario": "...", "senha": "..." }`                             |
| `GET`  | `/api/usuarios/ranking`  | Não       | Lista o ranking de usuários (paginado).   | Query Params: `?page=1`                                          |
| `GET`  | `/api/lessons/today`     | **Sim** | Busca os dados da lição do dia atual.     | N/A                                                              |
| `POST` | `/api/reviews`           | **Sim** | Submete uma nova review.                | `{ "conteudo": "...", "indiceLicao": "..." }`                   |
| `GET`  | `/api/reviews`           | Não       | Lista todas as reviews (paginado).      | Query Params: `?page=1`                                          |