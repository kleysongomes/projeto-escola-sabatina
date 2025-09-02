const db = require('../config/db');

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Função para listar todas as igrejas
const listAllIgrejas = async (req, res) => {
  try {
    const result = await db.query('SELECT id, nome FROM igrejas ORDER BY nome ASC');
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar igrejas:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

// Função para criar uma nova igreja
const createIgreja = async (req, res) => {
  const { nome, cidade, estado, pais } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ error: 'O nome da igreja não pode estar vazio.' });
  }

  const nomePadronizado = toTitleCase(nome);
  const cidadePadronizada = toTitleCase(cidade);
  const estadoPadronizado = toTitleCase(estado);
  const paisPadronizado = toTitleCase(pais);

  try {
    const insertQuery = `
      INSERT INTO igrejas (nome, cidade, estado, pais)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nomePadronizado, cidadePadronizada, estadoPadronizado, paisPadronizado];
    const result = await db.query(insertQuery, values);
    
    const newIgreja = result.rows[0];

    console.info(`INFO: Nova igreja criada: "${newIgreja.nome}" (ID: ${newIgreja.id}).`);

    res.status(201).json(newIgreja);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Uma igreja com este nome já existe.' });
    }
    console.error("Erro ao criar igreja:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

module.exports = {
  listAllIgrejas,
  createIgreja,
};