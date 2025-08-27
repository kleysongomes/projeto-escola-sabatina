// Importa o módulo 'fs' (File System) do Node.js para ler arquivos.
// Usamos a versão com 'promises' para trabalhar bem com async/await.
const fs = require('fs').promises;
// Importa o módulo 'path' para lidar com caminhos de arquivos de forma segura.
const path = require('path');
// Importa nossa configuração de conexão com o banco de dados.
const db = require('./db');

// Definimos uma função assíncrona para inicializar o banco.
async function initializeDatabase() {
  try {
    // Monta o caminho completo para o nosso arquivo init.sql.
    // '__dirname' é uma variável do Node que representa o diretório atual.
    const sqlFilePath = path.join(__dirname, 'init.sql');

    // Lê o conteúdo do arquivo SQL como texto.
    const sql = await fs.readFile(sqlFilePath, 'utf-8');

    // Executa o conteúdo do arquivo SQL no banco de dados.
    await db.query(sql);

    console.log("Banco de dados inicializado com sucesso: tabelas criadas ou já existentes.");
  } catch (error) {
    console.error("Falha ao inicializar o banco de dados:", error);
    // Se a inicialização falhar, encerramos o processo para evitar
    // que a aplicação rode em um estado inconsistente.
    process.exit(1);
  }
}

// Exportamos a função para que ela possa ser usada em outros arquivos.
module.exports = initializeDatabase;