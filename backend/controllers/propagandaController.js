const db = require('../config/db');

const createPropaganda = async (req, res) => {
    const { titulo, descricao, imagem_url, link_url, target_pais, target_estado, target_cidade, target_igreja_id } = req.body;

    if (!titulo || !imagem_url) {
        return res.status(400).json({ error: 'Título e URL da Imagem são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO propagandas (titulo, descricao, imagem_url, link_url, target_pais, target_estado, target_cidade, target_igreja_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [titulo, descricao, imagem_url, link_url, target_pais || null, target_estado || null, target_cidade || null, target_igreja_id || null];
        
        const result = await db.query(query, values);
        console.info(`INFO: Admin (ID: ${req.user.id}) criou a propaganda #${result.rows[0].id}.`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao criar propaganda:", error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

const listPropagandasForUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const userResult = await db.query('SELECT pais, estado, cidade, igreja_id FROM usuarios WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        const user = userResult.rows[0];

        const query = `
            SELECT * FROM propagandas
            WHERE
                (target_pais IS NULL AND target_estado IS NULL AND target_cidade IS NULL AND target_igreja_id IS NULL)
                OR (target_pais = $1 AND target_estado IS NULL AND target_cidade IS NULL)
                OR (target_estado = $2 AND target_pais = $1 AND target_cidade IS NULL)
                OR (target_cidade = $3 AND target_estado = $2 AND target_pais = $1)
                OR (target_igreja_id = $4)
            ORDER BY created_at DESC;
        `;
        const values = [user.pais, user.estado, user.cidade, user.igreja_id];
        const result = await db.query(query, values);
        
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao listar propagandas para o usuário:", error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

const getAllPropagandas = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM propagandas ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao listar todas as propagandas:", error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

const deletePropaganda = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM propagandas WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Propaganda não encontrada.' });
        }
        console.info(`INFO: Admin (ID: ${req.user.id}) deletou a propaganda #${id}.`);
        res.status(200).json({ message: 'Propaganda deletada com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar propaganda:", error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

const getPropagandaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM propagandas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Propaganda não encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(`Erro ao buscar propaganda #${id}:`, error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

const updatePropaganda = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, imagem_url, link_url, target_pais, target_estado, target_cidade, target_igreja_id } = req.body;
    if (!titulo || !imagem_url) {
        return res.status(400).json({ error: 'Título e URL da Imagem são obrigatórios.' });
    }
    try {
        const query = `
            UPDATE propagandas 
            SET titulo = $1, descricao = $2, imagem_url = $3, link_url = $4, target_pais = $5, target_estado = $6, target_cidade = $7, target_igreja_id = $8
            WHERE id = $9
            RETURNING *;
        `;
        const values = [titulo, descricao, imagem_url, link_url, target_pais || null, target_estado || null, target_cidade || null, target_igreja_id || null, id];
        const result = await db.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Propaganda não encontrada.' });
        }
        console.info(`INFO: Admin (ID: ${req.user.id}) atualizou a propaganda #${id}.`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Erro ao atualizar propaganda #${id}:`, error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

module.exports = {
    createPropaganda,
    listPropagandasForUser,
    getAllPropagandas,
    deletePropaganda,
    getPropagandaById,
    updatePropaganda,
};