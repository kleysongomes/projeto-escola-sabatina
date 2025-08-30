const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://projeto-escola-sabatina.onrender.com',
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

// Importa e usa as rotas de bug report ---
const bugRoutes = require('./routes/bugRoutes');
app.use('/api/bugs', bugRoutes);


// Função que inicializa o banco de dados e depois inicia o servidor
const startServer = async () => {
  const initializeDatabase = require('./config/databaseInit');
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();