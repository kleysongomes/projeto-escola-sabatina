require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Configuração de conexão
const connectionConfig = {
  // Em produção, usamos a URL completa fornecida pelo serviço de hospedagem
  connectionString: process.env.DATABASE_URL,
  // Em produção, a conexão SSL é obrigatória e não deve ser rejeitada
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

// Se não estivermos em produção, usamos as variáveis de ambiente individuais
if (!isProduction) {
  connectionConfig.user = process.env.DB_USER;
  connectionConfig.password = process.env.DB_PASSWORD;
  connectionConfig.host = process.env.DB_HOST;
  connectionConfig.port = process.env.DB_PORT;
  connectionConfig.database = process.env.DB_DATABASE;
}

const pool = new Pool(connectionConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
};