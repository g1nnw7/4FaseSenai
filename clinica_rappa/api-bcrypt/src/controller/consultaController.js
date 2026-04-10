import db from '../config/db.js'; // Ajuste conforme seu arquivo de conexão

export const listarConsultas = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM consultas ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar consultas' });
    }
};

export const criarConsulta = async (req, res) => {
    const { nome, data_consulta, hora_consulta, status } = req.body;
    try {
        const query = 'INSERT INTO consultas (nome, data_consulta, hora_consulta, status) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await db.query(query, [nome, data_consulta, hora_consulta, status]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar Consulta' });
    }
};

export const atualizarConsulta = async (req, res) => {
    const { id } = req.params;
    const { nome, data_consulta, hora_consulta, status } = req.body;
    try {
        const query = 'UPDATE consultas SET nome=$1, categoria=$2, sku=$3, status=$4 WHERE id=$7';
        await db.query(query, [nome, data_consulta, hora_consulta, status, id]);
        res.status(200).json({ message: 'Consulta atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar Consulta' });
    }
};

export const excluirConsulta = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM consultas WHERE id=$1', [id]);
        res.status(200).json({ message: 'Consulta excluída' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir Consulta' });
    }
};