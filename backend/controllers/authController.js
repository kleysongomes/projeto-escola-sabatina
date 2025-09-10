const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token não fornecido.' });
  }

  try {
    // Verifica se o refresh token é válido e não expirou
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    // Busca o usuário e o hash do refresh token salvo no banco
    const userResult = await db.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'Usuário não encontrado.' });
    }
    const user = userResult.rows[0];

    if (!user.refresh_token) {
      return res.status(403).json({ error: 'Nenhum refresh token ativo para este usuário.' });
    }

    // Compara o refresh token recebido com o hash salvo no banco
    const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!isMatch) {
      return res.status(403).json({ error: 'Refresh token inválido.' });
    }

    // Se tudo estiver certo, gera um NOVO access token
    const accessTokenPayload = { 
      id: user.id, 
      usuario: user.usuario,
      isAdmin: user.is_admin
    };
    const newAccessToken = jwt.sign(
      accessTokenPayload, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
    
    console.info(`INFO: Access token renovado para o usuário "${user.usuario}" (ID: ${user.id}).`);

    // Envia o novo access token para o frontend
    res.json({ accessToken: newAccessToken });

  } catch (error) {
    // Se jwt.verify falhar (token expirado, inválido, etc.), ele cairá aqui
    console.warn('WARN: Tentativa de refresh com token inválido ou expirado.', error.message);
    return res.status(403).json({ error: 'Refresh token inválido ou expirado.' });
  }
};

module.exports = {
  refreshToken,
};