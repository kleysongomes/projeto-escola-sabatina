const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { usuario, senha, pais, estado, cidade } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);
    const insertQuery = `
      INSERT INTO usuarios (usuario, senha_hash, pais, estado, cidade)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, usuario, data_criacao;
    `;
    const values = [usuario, senha_hash, pais, estado, cidade];
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
  const offset = (page - 1) * limit;
  try {
    const rankingQuery = `
      SELECT id, usuario, pais, cidade, pontos_totais 
      FROM usuarios
      ORDER BY pontos_totais DESC
      LIMIT $1 OFFSET $2;
    `;
    const countQuery = 'SELECT COUNT(*) FROM usuarios;';
    const rankingResult = await db.query(rankingQuery, [limit, offset]);
    const countResult = await db.query(countQuery);
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

module.exports = {
  registerUser,
  loginUser,
  getUserRanking,
};