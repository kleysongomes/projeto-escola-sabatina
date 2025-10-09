const db = require('../config/db');

// Para Usuários: Busca o título da lição do dia atual.
const getTodayTitle = async (req, res) => {
    try {
        const query = `
            SELECT titulo FROM titulos_licao 
            WHERE data_licao = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date;
        `;
        const result = await db.query(query);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            // Se nenhum título foi cadastrado para hoje, retorna um padrão.
            res.json({ titulo: 'Estudo do Dia' });
        }
    } catch (error) {
        console.error("Erro ao buscar título da lição do dia:", error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

// Para Admins: Cria ou atualiza o título de uma data específica.
const upsertTitle = async (req, res) => {
    const { data_licao, titulo } = req.body;

    if (!data_licao || !titulo) {
        return res.status(400).json({ error: 'A data e o título são obrigatórios.' });
    }

    try {
        // Esta consulta SQL faz um "upsert":
        // Se a data já existir, ele atualiza o título.
        // Se não existir, ele insere uma nova linha.
        const query = `
            INSERT INTO titulos_licao (data_licao, titulo)
            VALUES ($1, $2)
            ON CONFLICT (data_licao) 
            DO UPDATE SET titulo = EXCLUDED.titulo, updated_at = NOW()
            RETURNING *;
        `;
        const values = [data_licao, titulo];
        
        const result = await db.query(query, values);
        
        console.info(`INFO: Admin (ID: ${req.user.id}) salvou o título para a data ${data_licao}.`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao salvar título da lição:", error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

module.exports = {
    getTodayTitle,
    upsertTitle,
};