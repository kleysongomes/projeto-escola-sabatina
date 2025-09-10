require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  
  // Agora, o SSL só é ativado se a variável DATABASE_SSL for explicitamente 'true'.
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

// A lógica para desenvolvimento local (não-produção) permanece a mesma
if (!isProduction) {
  delete connectionConfig.connectionString; // Removemos para usar os campos individuais
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