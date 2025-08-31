const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função auxiliar para padronizar o texto (Ex: "sao paulo" -> "Sao Paulo")
const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const registerUser = async (req, res) => {
  const { usuario, senha, pais, estado, cidade, igreja_id } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const paisPadronizado = toTitleCase(pais);
    const estadoPadronizado = toTitleCase(estado);
    const cidadePadronizada = toTitleCase(cidade);

    const insertQuery = `
      INSERT INTO usuarios (usuario, senha_hash, pais, estado, cidade, igreja_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, usuario, data_criacao;
    `;
    const values = [usuario, senha_hash, paisPadronizado, estadoPadronizado, cidadePadronizada, igreja_id];
    
    const result = await db.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este nome de usuário já está em uso.' });
    }
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const loginUser = async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const userQuery = 'SELECT * FROM usuarios WHERE usuario = $1';
    const result = await db.query(userQuery, [usuario]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
    const payload = { 
      id: user.id, 
      usuario: user.usuario,
      isAdmin: user.is_admin
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const getUserRanking = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const { pais, estado, cidade, igreja_id } = req.query;
  
  let paramIndex = 1;
  const whereClauses = [];
  const queryParams = [];

  if (pais) {
    whereClauses.push(`u.pais ILIKE $${paramIndex++}`);
    queryParams.push(`%${pais}%`);
  }
  if (estado) {
    whereClauses.push(`u.estado ILIKE $${paramIndex++}`);
    queryParams.push(`%${estado}%`);
  }
  if (cidade) {
    whereClauses.push(`u.cidade ILIKE $${paramIndex++}`);
    queryParams.push(`%${cidade}%`);
  }
  if (igreja_id) {
    whereClauses.push(`u.igreja_id = $${paramIndex++}`);
    queryParams.push(igreja_id);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    const rankingQuery = `
      SELECT u.id, u.usuario, u.pais, u.cidade, u.pontos_totais, i.nome as igreja_nome 
      FROM usuarios u
      LEFT JOIN igrejas i ON u.igreja_id = i.id
      ${whereString}
      ORDER BY u.pontos_totais DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;
    const countQuery = `SELECT COUNT(*) FROM usuarios u ${whereString};`;

    const rankingParams = [...queryParams, limit, (page - 1) * limit];
    const countParams = [...queryParams];
    
    const rankingResult = await db.query(rankingQuery, rankingParams);
    const countResult = await db.query(countQuery, countParams);
    
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      ranking: rankingResult.rows,
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalUsers
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const checkUsername = async (req, res) => {
  const { usuario } = req.body;

  if (!usuario) {
    return res.status(400).json({ error: 'Nome de usuário não fornecido.' });
  }

  try {
    const result = await db.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
    
    if (result.rows.length > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserRanking,
  checkUsername,
};