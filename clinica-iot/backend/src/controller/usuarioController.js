import db from '../config/db.js';
import bcrypt from 'bcrypt';

export async function getTodosMedicos(req, res) {
    try {
        const query = `
            SELECT id, nome, email, role, status, especialidade
            FROM usuarios
            WHERE role = 'DOCTOR'
            ORDER BY nome ASC
        `;
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (error) {
        console.error('Erro em getTodosMedicos:', error);
        return res.status(500).json({ error: 'Erro ao buscar médicos' });
    }
}

export async function getMedicosDisponiveis(req, res) {
    try {
        const query = `
            SELECT id, nome, email, status, especialidade
            FROM usuarios
            WHERE role = 'DOCTOR' AND status = 'disponivel'
            ORDER BY nome ASC
        `;
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (error) {
        console.error('Erro em getMedicosDisponiveis:', error);
        return res.status(500).json({ error: 'Erro ao buscar médicos disponíveis' });
    }
}

export async function atualizarStatusMedico(req, res) {
    try {
        const { status } = req.body;
        const medicoId = req.usuario.id;

        const statusValidos = ['disponivel', 'em_consulta', 'indisponivel'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ error: 'Status inválido. Use: disponivel, em_consulta ou indisponivel' });
        }

        const query = `
            UPDATE usuarios
            SET status = $1
            WHERE id = $2 AND role = 'DOCTOR'
            RETURNING id, nome, status
        `;
        const result = await db.query(query, [status, medicoId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Médico não encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro em atualizarStatusMedico:', error);
        return res.status(500).json({ error: 'Erro ao atualizar status' });
    }
}

export async function getTodosUsuarios(req, res) {
    try {
        const query = `
            SELECT id, nome, email, role, especialidade
            FROM usuarios
            ORDER BY id ASC
        `;
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (error) {
        console.error('Erro em getTodosUsuarios:', error);
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}

export async function getUsuarioPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const query = 'SELECT id, nome, email, role, status, especialidade FROM usuarios WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro em getUsuarioPorId:', error);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
}