const db = require('../config/db');

const getDailyLesson = async (req, res) => {
  try {
    const userId = req.user.id;

    // A verificação se o usuário já enviou a review continua a mesma
    const reviewCheckQuery = `
      SELECT id FROM reviews 
      WHERE id_usuario = $1 
      AND (data_criacao AT TIME ZONE 'America/Sao_Paulo')::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date;
    `;
    const reviewCheckResult = await db.query(reviewCheckQuery, [userId]);
    const userHasSubmitted = reviewCheckResult.rows.length > 0;

    // Cria uma data baseada no fuso horário do Brasil
    const today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));

    // Formata a data para ser o nosso novo "título"
    const formattedDate = today.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Cria o objeto padrão que será enviado ao frontend
    const lessonData = {
      title: `Estudo de ${formattedDate}`,
      date: today.toLocaleDateString('pt-BR'), // Formato simples para o cache (ex: 28/09/2025)
      index: today.toISOString().split('T')[0], // Formato YYYY-MM-DD para o índice
      userHasSubmitted: userHasSubmitted
    };
    
    console.info(`INFO: Usuário ${userId} buscou a lição padrão do dia. Status de envio: ${userHasSubmitted}`);

    res.json(lessonData);

  } catch (error) {
    console.error("Erro ao buscar dados da lição:", error);
    res.status(500).json({ error: 'Não foi possível buscar os dados da lição.' });
  }
};

module.exports = {
  getDailyLesson,
};