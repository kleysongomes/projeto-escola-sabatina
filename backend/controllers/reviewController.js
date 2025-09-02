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
  if (conteudo.length > 500) {
    return res.status(400).json({ error: 'A review não pode ter mais de 500 caracteres.' });
  }

  try {
    if (!req.user.isAdmin) {
      const dailyReviewCheckQuery = `
        SELECT id FROM reviews 
        WHERE id_usuario = $1 
        AND (data_criacao AT TIME ZONE 'America/Sao_Paulo')::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date;
      `;
      const existingReview = await db.query(dailyReviewCheckQuery, [userId]);

      if (existingReview.rows.length > 0) {
        return res.status(409).json({ error: 'Você já enviou uma review hoje.' });
      }
    }

    const now = new Date();
    now.setHours(now.getHours() - 3);
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

    const newReviewResult = await db.query(insertReviewQuery, reviewValues);
    await db.query(updateUserPointsQuery, userValues);

    const newReview = newReviewResult.rows[0];
    console.info(`INFO: Review ${newReview.id} criada pelo usuário ${userId}, gerando ${pontosGanhos} pontos.`);
    
    res.status(201).json(newReview);

  } catch (error) {
    console.error("Erro ao submeter review:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const listAllReviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const userId = req.user?.id || null; 

  try {
    const reviewsQuery = `
      SELECT 
        r.id, 
        r.conteudo, 
        r.pontos_ganhos, 
        r.data_criacao, 
        u.usuario,
        COUNT(DISTINCT l.user_id)::int AS "likesCount",
        COALESCE(
          (SELECT true FROM review_likes WHERE review_id = r.id AND user_id = $3),
          false
        ) AS "isLikedByCurrentUser"
      FROM reviews r
      JOIN usuarios u ON r.id_usuario = u.id
      LEFT JOIN review_likes l ON l.review_id = r.id
      GROUP BY r.id, u.usuario
      ORDER BY r.data_criacao DESC
      LIMIT $1 OFFSET $2;
    `;
    const countQuery = 'SELECT COUNT(*) FROM reviews;';
    
    const reviewsResult = await db.query(reviewsQuery, [limit, offset, userId]);
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
  const adminUserId = req.user.id;
  let client;

  try {
    client = await db.getClient();
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

    console.info(`INFO: ADMIN ACTION: Usuário admin ${adminUserId} deletou a review ${id} (originalmente do usuário ${id_usuario}).`);
    res.status(200).json({ message: 'Review deletada com sucesso.' });

  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error(`Erro ao deletar review ${id} pelo admin ${adminUserId}:`, error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  } finally {
    if (client) client.release();
  }
};

const likeReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    const likeCheckQuery = 'SELECT id FROM review_likes WHERE user_id = $1 AND review_id = $2';
    const likeCheckResult = await db.query(likeCheckQuery, [userId, reviewId]);

    if (likeCheckResult.rows.length > 0) {
      const deleteLikeQuery = 'DELETE FROM review_likes WHERE user_id = $1 AND review_id = $2';
      await db.query(deleteLikeQuery, [userId, reviewId]);
      console.info(`INFO: Usuário ${userId} removeu o like da review ${reviewId}.`);
      res.status(200).json({ message: 'Like removido.' });
    } else {
      const insertLikeQuery = 'INSERT INTO review_likes (user_id, review_id) VALUES ($1, $2)';
      await db.query(insertLikeQuery, [userId, reviewId]);
      console.info(`INFO: Usuário ${userId} curtiu a review ${reviewId}.`);
      res.status(200).json({ message: 'Review curtida.' });
    }
  } catch (error) {
    console.error("Erro ao processar like:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

const reportReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    const insertReportQuery = 'INSERT INTO review_reports (user_id, review_id) VALUES ($1, $2)';
    await db.query(insertReportQuery, [userId, reviewId]);
    console.info(`INFO: Usuário ${userId} reportou a review ${reviewId}.`);
    res.status(200).json({ message: 'Review reportada com sucesso. Agradecemos sua colaboração.' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Você já reportou esta review.' });
    }
    console.error("Erro ao reportar review:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

module.exports = {
  submitReview,
  listAllReviews,
  deleteReview,
  likeReview,
  reportReview,
};