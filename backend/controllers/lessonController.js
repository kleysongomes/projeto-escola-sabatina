const axios = require('axios');
const db = require('../config/db');

const getDailyLesson = async (req, res) => {
  let apiUrl = ''; // Definido aqui fora para ser acessível no bloco catch
  try {
    const userId = req.user.id;

    const reviewCheckQuery = `
      SELECT id FROM reviews 
      WHERE id_usuario = $1 
      AND (data_criacao AT TIME ZONE 'America/Sao_Paulo')::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date;
    `;
    const reviewCheckResult = await db.query(reviewCheckQuery, [userId]);
    const userHasSubmitted = reviewCheckResult.rows.length > 0;

    const today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));

    const year = today.getFullYear();
    const currentMonth = today.getMonth();
    const quarterNumber = Math.floor(currentMonth / 3) + 1;
    const quarterIdentifier = `${year}-${String(quarterNumber).padStart(2, '0')}-cq`;
    
    const quarterStartMonthIndex = (quarterNumber - 1) * 3;
    const quarterStartDate = new Date(Date.UTC(year, quarterStartMonthIndex, 1));
    const firstDayOfWeekInQuarter = quarterStartDate.getUTCDay();

    const daysToAdd = (6 - firstDayOfWeekInQuarter + 7) % 7;
    let lessonQuarterStartDate = new Date(quarterStartDate);
    lessonQuarterStartDate.setUTCDate(quarterStartDate.getUTCDate() + daysToAdd);

    if (firstDayOfWeekInQuarter <= 3) {
      lessonQuarterStartDate.setUTCDate(lessonQuarterStartDate.getUTCDate() - 7);
    }
    
    const todayAtStartOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const diffInMs = todayAtStartOfDay - lessonQuarterStartDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const lessonWeek = String(Math.floor(diffInDays / 7) + 1).padStart(2, '0');
    
    const dayOfWeekJS = today.getDay();
    const dayMap = [2, 3, 4, 5, 6, 7, 1];
    const lessonDay = String(dayMap[dayOfWeekJS]).padStart(2, '0');
    
    apiUrl = `https://sabbath-school.adventech.io/api/v2/pt/quarterlies/${quarterIdentifier}/lessons/${lessonWeek}/days/${lessonDay}/index.json`;
    
    const lessonResponse = await axios.get(apiUrl);
    
    // Log de informação unificado
    console.info(`INFO: Usuário ${userId} buscou a lição. URL: ${apiUrl}. Status de envio: ${userHasSubmitted}`);

    res.json({
      ...lessonResponse.data,
      userHasSubmitted: userHasSubmitted
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Log de aviso para lições não encontradas
      console.warn(`WARN: Lição não encontrada na API externa para a URL: ${apiUrl}`);
      return res.status(404).json({ error: 'Lição para o dia de hoje não encontrada.' });
    }
    // Log de erro para falhas inesperadas
    console.error("Erro ao buscar dados da lição:", error);
    res.status(500).json({ error: 'Não foi possível buscar os dados da lição.' });
  }
};

module.exports = {
  getDailyLesson,
};