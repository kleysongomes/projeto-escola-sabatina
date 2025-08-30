const db = require('../config/db');

const createBugReport = async (req, res) => {
  // A ID do usuário vem do token, pois a rota será protegida
  const userId = req.user.id;
  // A descrição e a URL vêm do corpo da requisição
  const { description, pageUrl } = req.body;

  // Validação simples
  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'A descrição do bug não pode estar vazia.' });
  }

  try {
    const insertQuery = `
      INSERT INTO bug_reports (user_id, description, page_url)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [userId, description, pageUrl];

    await db.query(insertQuery, values);

    res.status(201).json({ message: 'Report de bug enviado com sucesso. Obrigado pela sua ajuda!' });
  } catch (error) {
    console.error("Erro ao salvar report de bug:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

module.exports = {
  createBugReport,
};