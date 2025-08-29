const db = require('../config/db');

const submitReview = async (req, res) => {
  const userId = req.user.id;
  const { conteudo, indiceLicao } = req.body;

  if (!conteudo || conteudo.trim() === '') {
    return res.status(400).json({ error: 'O conteúdo da review não pode estar vazio.' });
  }
  if (!indiceLicao) {
    return res.status(400).json({ error: 'O índice da lição é obrigatório.' });
  }

  try {
    const now = new Date();
    now.setHours(now.getHours() - 3);

    if (!req.user.isAdmin) {
      const dailyReviewCheckQuery = `
        SELECT id FROM reviews WHERE id_usuario = $1 AND DATE(data_criacao AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') = DATE($2);
      `;
      const existingReview = await db.query(dailyReviewCheckQuery, [userId, now]);

      if (existingReview.rows.length > 0) {
        return res.status(409).json({ error: 'Você já enviou uma review hoje.' });
      }
    }

    const hour = now.getHours();
    const characterCount = conteudo.length;
    let pontosPorHorario = 0;

    if (hour >= 4 && hour < 6) {
      pontosPorHorario = 100;
    } else if (hour >= 6 && hour < 12) {
      pontosPorHorario = 75;
    } else if (hour >= 12 && hour < 18) {
      pontosPorHorario = 50;
    } else if (hour >= 18 && hour <= 23) {
      pontosPorHorario = 25;
    } else {
      pontosPorHorario = 10;
    }

    let pontosPorConteudo = Math.floor(characterCount / 20);
    if (pontosPorConteudo > 50) {
      pontosPorConteudo = 50;
    }

    const pontosGanhos = pontosPorHorario + pontosPorConteudo;

    const insertReviewQuery = `
      INSERT INTO reviews (id_usuario, indice_licao, conteudo, quantidade_caracteres, pontos_ganhos)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const reviewValues = [userId, indiceLicao, conteudo, characterCount, pontosGanhos];
    
    const updateUserPointsQuery = `
      UPDATE usuarios SET pontos_totais = pontos_totais + $1 WHERE id = $2;
    `;
    const userValues = [pontosGanhos, userId];

    const newReview = await db.query(insertReviewQuery, reviewValues);
    await db.query(updateUserPointsQuery, userValues);

    res.status(201).json(newReview.rows[0]);

  } catch (error) {
    console.error("Erro ao submeter review:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const listAllReviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  try {
    const reviewsQuery = `
      SELECT 
        r.id, r.conteudo, r.pontos_ganhos, r.data_criacao, u.usuario 
      FROM reviews r
      JOIN usuarios u ON r.id_usuario = u.id
      /* MUDANÇA AQUI: Ordenando pela data de criação da review (mais recente primeiro) */
      ORDER BY r.data_criacao DESC
      LIMIT $1 OFFSET $2;
    `;
    const countQuery = 'SELECT COUNT(*) FROM reviews;';
    const reviewsResult = await db.query(reviewsQuery, [limit, offset]);
    const countResult = await db.query(countQuery);
    const totalReviews = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalReviews / limit);
    res.json({
      reviews: reviewsResult.rows,
      currentPage: page,
      totalPages: totalPages,
      totalReviews: totalReviews
    });
  } catch (error) {
    console.error("Erro ao listar reviews:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const reviewQuery = 'SELECT id_usuario, pontos_ganhos FROM reviews WHERE id = $1';
    const reviewResult = await client.query(reviewQuery, [id]);

    if (reviewResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Review não encontrada.' });
    }
    
    const { id_usuario, pontos_ganhos } = reviewResult.rows[0];

    const updateUserQuery = 'UPDATE usuarios SET pontos_totais = pontos_totais - $1 WHERE id = $2';
    await client.query(updateUserQuery, [pontos_ganhos, id_usuario]);

    const deleteQuery = 'DELETE FROM reviews WHERE id = $1';
    await client.query(deleteQuery, [id]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Review deletada com sucesso.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Erro ao deletar review:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  } finally {
    client.release();
  }
};

module.exports = {
  submitReview,
  listAllReviews,
  deleteReview,
};