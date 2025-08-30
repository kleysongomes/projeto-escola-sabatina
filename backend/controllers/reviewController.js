const db = require('../config/db');

const submitReview = async (req, res) => {
  // Nenhuma alteração nesta função
  const userId = req.user.id;
  const { conteudo, indiceLicao } = req.body;

  if (!conteudo || conteudo.trim() === '') {
    return res.status(400).json({ error: 'O conteúdo da review não pode estar vazio.' });
  }
  if (!indiceLicao) {
    return res.status(400).json({ error: 'O índice da lição é obrigatório.' });
  }
  if (conteudo.length > 300) {
    return res.status(400).json({ error: 'A review não pode ter mais de 300 caracteres.' });
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
  // Precisamos da ID do usuário logado para saber se ele curtiu os posts
  const userId = req.user?.id || null; 

  try {
    // A consulta SQL foi bastante modificada para incluir a contagem de likes
    const reviewsQuery = `
      SELECT 
        r.id, 
        r.conteudo, 
        r.pontos_ganhos, 
        r.data_criacao, 
        u.usuario,
        -- Contar o número de likes para cada review
        COUNT(DISTINCT l.user_id)::int AS "likesCount",
        -- Verificar se o usuário logado (userId, passado como $3) já deu like
        -- COALESCE garante que o resultado seja 'false' se não houver likes
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

const deleteReview = async (req, res) => { /* ... (código existente, sem alterações) ... */ };

// NOVA FUNÇÃO para curtir/descurtir uma review
const likeReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    // Verifica se o usuário já curtiu esta review
    const likeCheckQuery = 'SELECT id FROM review_likes WHERE user_id = $1 AND review_id = $2';
    const likeCheckResult = await db.query(likeCheckQuery, [userId, reviewId]);

    if (likeCheckResult.rows.length > 0) {
      // Se já curtiu, descurte (deleta o registro)
      const deleteLikeQuery = 'DELETE FROM review_likes WHERE user_id = $1 AND review_id = $2';
      await db.query(deleteLikeQuery, [userId, reviewId]);
      res.status(200).json({ message: 'Like removido.' });
    } else {
      // Se não curtiu, curta (insere o registro)
      const insertLikeQuery = 'INSERT INTO review_likes (user_id, review_id) VALUES ($1, $2)';
      await db.query(insertLikeQuery, [userId, reviewId]);
      res.status(200).json({ message: 'Review curtida.' });
    }
  } catch (error) {
    console.error("Erro ao processar like:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};

// NOVA FUNÇÃO para reportar uma review
const reportReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    // Tenta inserir o report. O banco de dados impedirá a duplicata.
    const insertReportQuery = 'INSERT INTO review_reports (user_id, review_id) VALUES ($1, $2)';
    await db.query(insertReportQuery, [userId, reviewId]);
    res.status(200).json({ message: 'Review reportada com sucesso. Agradecemos sua colaboração.' });
  } catch (error) {
    // O código '23505' é de violação de chave única (já reportou)
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