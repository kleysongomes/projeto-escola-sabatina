const axios = require('axios');

const getDailyLesson = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const currentMonth = today.getMonth(); // 0 = Janeiro, 11 = Dezembro

    // 1. Calculando o Trimestre (LÓGICA CORRIGIDA)
    // O número na URL é o trimestre do ano (1 a 4).
    const quarterNumber = Math.floor(currentMonth / 3) + 1;
    const quarterIdentifier = `${year}-${String(quarterNumber).padStart(2, '0')}-cq`;

    // 2. Calculando a Semana da Lição
    // Para este cálculo, ainda precisamos saber qual é o primeiro mês do trimestre.
    const quarterStartMonthIndex = (quarterNumber - 1) * 3;
    const quarterStartDate = new Date(year, quarterStartMonthIndex, 1);
    const diffInMs = today - quarterStartDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const lessonWeek = String(Math.ceil(diffInDays / 7)).padStart(2, '0');

    // 3. Calculando o Dia da Semana (esta lógica permanece a mesma)
    const dayOfWeekJS = today.getDay();
    const dayMap = [2, 3, 4, 5, 6, 7, 1];
    const lessonDay = String(dayMap[dayOfWeekJS]).padStart(2, '0');

    // 4. Montando a URL final
    const apiUrl = `https://sabbath-school.adventech.io/api/v2/pt/quarterlies/${quarterIdentifier}/lessons/${lessonWeek}/days/${lessonDay}/index.json`;
    
    console.log("URL da API corrigida:", apiUrl);

    const response = await axios.get(apiUrl);

    console.log(`Usuário '${req.user.usuario}' (ID: ${req.user.id}) acessou a lição.`);

    res.json(response.data);

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