const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    const newUser = result.rows[0];

    console.info(`INFO: Novo usuário registrado: "${newUser.usuario}" (ID: ${newUser.id}).`);

    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === '23505') {
      console.warn(`WARN: Tentativa de registro com usuário duplicado: "${usuario}".`);
      return res.status(409).json({ error: 'Este nome de usuário já está em uso.' });
    }
    console.error(`Erro ao registrar usuário "${usuario}":`, error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const loginUser = async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const userQuery = 'SELECT * FROM usuarios WHERE usuario = $1';
    const result = await db.query(userQuery, [usuario]);
    if (result.rows.length === 0) {
      console.warn(`WARN: Tentativa de login falhou (usuário não encontrado): "${usuario}".`);
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      console.warn(`WARN: Tentativa de login falhou (senha incorreta) para o usuário: "${usuario}".`);
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
    
    const accessTokenPayload = { 
      id: user.id, 
      usuario: user.usuario,
      isAdmin: user.is_admin
    };
    const accessToken = jwt.sign(accessTokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });

    const refreshTokenPayload = { id: user.id };
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await db.query('UPDATE usuarios SET refresh_token = $1 WHERE id = $2', [refreshTokenHash, user.id]);

    console.info(`INFO: Usuário "${user.usuario}" (ID: ${user.id}) logado com sucesso.`);

    res.json({ accessToken, refreshToken });

  } catch (error) {
    console.error(`Erro no login do usuário "${usuario}":`, error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const logoutUser = async (req, res) => {
  const userId = req.user.id;
  try {
    await db.query('UPDATE usuarios SET refresh_token = NULL WHERE id = $1', [userId]);
    console.info(`INFO: Usuário (ID: ${userId}) deslogado com sucesso.`);
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    console.error(`Erro no logout do usuário (ID: ${userId}):`, error);
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

const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `
      SELECT u.id, u.usuario, u.pais, u.estado, u.cidade, u.pontos_totais, u.data_criacao, i.nome as igreja_nome
      FROM usuarios u
      LEFT JOIN igrejas i ON u.igreja_id = i.id
      WHERE u.id = $1;
    `;
    const result = await db.query(query, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar perfil do usuário ${userId}:`, error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const getUserReviews = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const reviewsQuery = `
      SELECT * FROM reviews 
      WHERE id_usuario = $1 
      ORDER BY data_criacao DESC 
      LIMIT $2 OFFSET $3;
    `;
    const countQuery = 'SELECT COUNT(*) FROM reviews WHERE id_usuario = $1;';

    const reviewsResult = await db.query(reviewsQuery, [userId, limit, offset]);
    const countResult = await db.query(countQuery, [userId]);
    
    const totalReviews = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalReviews / limit);

    res.json({
      reviews: reviewsResult.rows,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(`Erro ao buscar reviews do usuário ${userId}:`, error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const getUserLikedReviews = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const reviewsQuery = `
      SELECT 
        r.id, r.conteudo, r.pontos_ganhos, r.data_criacao, u.usuario 
      FROM reviews r
      JOIN review_likes l ON r.id = l.review_id
      JOIN usuarios u ON r.id_usuario = u.id
      WHERE l.user_id = $1
      ORDER BY l.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const countQuery = 'SELECT COUNT(*) FROM review_likes WHERE user_id = $1;';

    const reviewsResult = await db.query(reviewsQuery, [userId, limit, offset]);
    const countResult = await db.query(countQuery, [userId]);

    const totalReviews = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalReviews / limit);

    res.json({
      reviews: reviewsResult.rows,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(`Erro ao buscar reviews curtidas pelo usuário ${userId}:`, error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserRanking,
  checkUsername,
  getUserProfile,
  getUserReviews,
  getUserLikedReviews,
};