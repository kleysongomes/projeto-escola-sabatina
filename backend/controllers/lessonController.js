const axios = require('axios');
const db = require('../config/db');

const getDailyLesson = async (req, res) => {
  try {
    const today = new Date();
    
    // 1. AJUSTE DE FUSO HORÁRIO PARA O BRASIL (BRT is UTC-3)
    // Subtrai 3 horas da data do servidor (UTC) para obter a data correta no Brasil.
    today.setHours(today.getHours() - 3);

    const year = today.getFullYear();
    const currentMonth = today.getMonth();

    // Calculando o Trimestre
    const quarterNumber = Math.floor(currentMonth / 3) + 1;
    const quarterIdentifier = `${year}-${String(quarterNumber).padStart(2, '0')}-cq`;

    // Calculando a Semana da Lição
    const quarterStartMonthIndex = (quarterNumber - 1) * 3;
    const quarterStartDate = new Date(year, quarterStartMonthIndex, 1);
    const diffInMs = today - quarterStartDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const lessonWeek = String(Math.ceil(diffInDays / 7)).padStart(2, '0');

    // Calculando o Dia da Semana
    const dayOfWeekJS = today.getDay();
    const dayMap = [2, 3, 4, 5, 6, 7, 1];
    const lessonDay = String(dayMap[dayOfWeekJS]).padStart(2, '0');

    // Montando a URL final
    const apiUrl = `https://sabbath-school.adventech.io/api/v2/pt/quarterlies/${quarterIdentifier}/lessons/${lessonWeek}/days/${lessonDay}/index.json`;
    
    const lessonResponse = await axios.get(apiUrl);

    const userId = req.user.id;
    // 2. CONSULTA AO BANCO CORRIGIDA
    // Usamos a data já ajustada como parâmetro ($2) em vez de CURRENT_DATE
    // para garantir consistência entre o app e o banco.
    const reviewCheckQuery = `
      SELECT id FROM reviews WHERE id_usuario = $1 AND DATE(data_criacao AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') = DATE($2);
    `;
    const reviewCheckResult = await db.query(reviewCheckQuery, [userId, today]);
    const userHasSubmitted = reviewCheckResult.rows.length > 0;

    console.log(`Usuário '${req.user.usuario}' (ID: ${userId}) acessou a lição. Já enviou review hoje: ${userHasSubmitted}`);

    res.json({
      ...lessonResponse.data,
      userHasSubmitted: userHasSubmitted
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Lição para o dia de hoje não encontrada.' });
    }
    console.error("Erro ao buscar dados da lição:", error);
    res.status(500).json({ error: 'Não foi possível buscar os dados da lição.' });
  }
};

module.exports = {
  getDailyLesson,
};