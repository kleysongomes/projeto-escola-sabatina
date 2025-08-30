const axios = require('axios');
const db = require('../config/db');

const getDailyLesson = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviewCheckQuery = `
      SELECT id FROM reviews 
      WHERE id_usuario = $1 
      AND (data_criacao AT TIME ZONE 'America/Sao_Paulo')::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date;
    `;
    const reviewCheckResult = await db.query(reviewCheckQuery, [userId]);
    const userHasSubmitted = reviewCheckResult.rows.length > 0;

    // --- LÓGICA DE DATA ---
    const today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));

    const year = today.getFullYear();
    const currentMonth = today.getMonth();
    const quarterNumber = Math.floor(currentMonth / 3) + 1;
    const quarterIdentifier = `${year}-${String(quarterNumber).padStart(2, '0')}-cq`;
    
    // 1. Encontra o primeiro dia do mês em que o trimestre começa
    const quarterStartMonthIndex = (quarterNumber - 1) * 3;
    const quarterStartDate = new Date(Date.UTC(year, quarterStartMonthIndex, 1));
    const firstDayOfWeekInQuarter = quarterStartDate.getUTCDay(); // Dom=0, Seg=1, ..., Sáb=6

    // 2. Encontra o primeiro Sábado DESSE mês
    const daysToAdd = (6 - firstDayOfWeekInQuarter + 7) % 7;
    let lessonQuarterStartDate = new Date(quarterStartDate);
    lessonQuarterStartDate.setUTCDate(quarterStartDate.getUTCDate() + daysToAdd);

    // 3. VERIFICA SE A PRIMEIRA LIÇÃO COMEÇOU NO MÊS ANTERIOR
    // Se o primeiro dia do trimestre for de Dom a Qua (0-3), o Sábado anterior é o mais próximo.
    if (firstDayOfWeekInQuarter <= 3) {
      lessonQuarterStartDate.setUTCDate(lessonQuarterStartDate.getUTCDate() - 7);
    }
    
    // 4. Calcula a diferença de dias a partir da data de início CORRETA
    const todayAtStartOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const diffInMs = todayAtStartOfDay - lessonQuarterStartDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // 5. Calcula a semana da lição
    const lessonWeek = String(Math.floor(diffInDays / 7) + 1).padStart(2, '0');
    
    const dayOfWeekJS = today.getDay();
    const dayMap = [2, 3, 4, 5, 6, 7, 1]; // Dom, Seg, Ter, Qua, Qui, Sex, Sáb
    const lessonDay = String(dayMap[dayOfWeekJS]).padStart(2, '0');
    // --- FIM DA LÓGICA DE DATA ---
    
    const apiUrl = `https://sabbath-school.adventech.io/api/v2/pt/quarterlies/${quarterIdentifier}/lessons/${lessonWeek}/days/${lessonDay}/index.json`;
    
    const lessonResponse = await axios.get(apiUrl);
    
    console.log(`Buscando lição com URL: ${apiUrl}`);

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