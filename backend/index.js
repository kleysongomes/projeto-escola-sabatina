const express = require('express');
const cors = require('cors'); // Importamos o pacote CORS

const app = express();
const PORT = 3000;

// Middleware para entender JSON
app.use(express.json());

// Middleware do CORS (DEVE VIR ANTES DAS ROTAS)
// Isso dirá ao nosso servidor para aceitar requisições do nosso app Vue
const corsOptions = {
  origin: [
    'http://localhost:5173'
  ]
};
app.use(cors(corsOptions));

// Importa e usa as rotas de usuário
const userRoutes = require('./routes/userRoutes');
app.use('/api/usuarios', userRoutes);

// Importa e usa as rotas da lição
const lessonRoutes = require('./routes/lessonRoutes');
app.use('/api/lessons', lessonRoutes);

// Importa e usa as rotas de review
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);


// Função que inicializa o banco de dados e depois inicia o servidor
const startServer = async () => {
  const initializeDatabase = require('./config/databaseInit');
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();