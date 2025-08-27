// Carrega as variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

// Importa a classe Pool do pacote 'pg'
const { Pool } = require('pg');

// Cria uma nova instância do Pool com as configurações do banco de dados
// que lemos do arquivo .env.
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Documentação: O 'Pool' é mais eficiente que uma conexão simples. Ele gerencia
// múltiplas conexões simultaneamente. Quando você precisa fazer uma consulta,
// ele te "empresta" uma conexão que já está aberta, e quando você termina,
// a conexão volta para o Pool, pronta para ser usada por outra parte do seu código.

// Exportamos um objeto com um método 'query' que será nossa única forma de
// interagir com o banco de dados a partir de outros arquivos.
module.exports = {
  query: (text, params) => pool.query(text, params),
};