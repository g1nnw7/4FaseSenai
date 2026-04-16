import db from '../config/db.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function maisde24horas(dataHora) {
    const agora = new Date();
    const consulta = new Date(dataHora);
    const diffMs = consulta - agora;
    return diffMs > 24 * 60 * 60 * 1000;
}

async function verificarConflitoPaciente(pacienteId, dataHora, duracaoMinutos, excluirId = null) {
    const query = `
        SELECT id FROM consultas
        WHERE paciente_id = $1
          AND status = 'agendada'
          AND (
              $2::timestamp < data_hora + (duracao_minutos || ' minutes')::interval
              AND
              $2::timestamp + ($3 || ' minutes')::interval > data_hora
          )
          ${excluirId ? 'AND id != $4' : ''}
    `;
    const params = excluirId
        ? [pacienteId, dataHora, duracaoMinutos, excluirId]
        : [pacienteId, dataHora, duracaoMinutos];
    const result = await db.query(query, params);
    return result.rows.length > 0;
}

async function verificarConflitoMedico(medicoId, dataHora, duracaoMinutos, excluirId = null) {
    const query = `
        SELECT id FROM consultas
        WHERE medico_id = $1
          AND status = 'agendada'
          AND (
              $2::timestamp < data_hora + (duracao_minutos || ' minutes')::interval
              AND
              $2::timestamp + ($3 || ' minutes')::interval > data_hora
          )
          ${excluirId ? 'AND id != $4' : ''}
    `;
    const params = excluirId
        ? [medicoId, dataHora, duracaoMinutos, excluirId]
        : [medicoId, dataHora, duracaoMinutos];
    const result = await db.query(query, params);
    return result.rows.length > 0;
}

// ── USER: buscar suas consultas ───────────────────────────────────────────────

export async function getMinhasConsultas(req, res) {
    try {
        const pacienteId = req.usuario.id;
        const query = `
            SELECT
                c.id,
                c.data_hora,
                c.duracao_minutos,
                c.motivo,
                c.status,
                c.observacoes,
                c.criado_em,
                u.nome AS medico_nome,
                u.especialidade AS medico_especialidade,
                u.status AS medico_status
            FROM consultas c
            JOIN usuarios u ON c.medico_id = u.id
            WHERE c.paciente_id = $1
            ORDER BY c.data_hora DESC
        `;
        const result = await db.query(query, [pacienteId]);
        return res.json(result.rows);
    } catch (error) {
        console.error('Erro em getMinhasConsultas:', error);
        return res.status(500).json({ error: 'Erro ao buscar consultas' });
    }
}

// ── USER: agendar consulta ────────────────────────────────────────────────────

export async function agendarConsulta(req, res) {
    try {
        const pacienteId = req.usuario.id;
        const { medico_id, data_hora, motivo, duracao_minutos = 30 } = req.body;

        if (!medico_id || !data_hora) {
            return res.status(400).json({ error: 'Médico e data/hora são obrigatórios' });
        }

        // Verifica se o médico existe e é DOCTOR com status disponivel
        const medicoQuery = 'SELECT id, status, role FROM usuarios WHERE id = $1 AND role = $2';
        const medicoResult = await db.query(medicoQuery, [medico_id, 'DOCTOR']);

        if (medicoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Médico não encontrado' });
        }

        if (medicoResult.rows[0].status !== 'disponivel') {
            return res.status(400).json({ error: 'Este médico não está disponível para agendamentos' });
        }

        // Verifica se a data é futura
        if (new Date(data_hora) <= new Date()) {
            return res.status(400).json({ error: 'A data da consulta deve ser futura' });
        }

        // Verifica conflito do paciente (não pode ter 2 consultas no mesmo horário)
        const conflitoPaciente = await verificarConflitoPaciente(pacienteId, data_hora, duracao_minutos);
        if (conflitoPaciente) {
            return res.status(409).json({ error: 'Você já tem uma consulta neste horário' });
        }

        // Verifica conflito do médico (médico não pode ter 2 consultas no mesmo horário)
        const conflitoMedico = await verificarConflitoMedico(medico_id, data_hora, duracao_minutos);
        if (conflitoMedico) {
            return res.status(409).json({ error: 'Este médico já possui uma consulta neste horário' });
        }

        const query = `
            INSERT INTO consultas (paciente_id, medico_id, data_hora, duracao_minutos, motivo, status)
            VALUES ($1, $2, $3, $4, $5, 'agendada')
            RETURNING *
        `;
        const result = await db.query(query, [pacienteId, medico_id, data_hora, duracao_minutos, motivo]);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro em agendarConsulta:', error);
        return res.status(500).json({ error: 'Erro ao agendar consulta' });
    }
}

// ── USER: cancelar consulta (só com 24h de antecedência) ──────────────────────

export async function cancelarConsultaUser(req, res) {
    try {
        const pacienteId = req.usuario.id;
        const id = Number(req.params.id);

        const busca = await db.query(
            'SELECT * FROM consultas WHERE id = $1 AND paciente_id = $2',
            [id, pacienteId]
        );

        if (busca.rows.length === 0) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

        const consulta = busca.rows[0];

        if (consulta.status !== 'agendada') {
            return res.status(400).json({ error: 'Só é possível cancelar consultas agendadas' });
        }

        if (!maisde24horas(consulta.data_hora)) {
            return res.status(400).json({ error: 'Consultas só podem ser canceladas com mais de 24h de antecedência' });
        }

        const query = `
            UPDATE consultas SET status = 'cancelada'
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [id]);

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro em cancelarConsultaUser:', error);
        return res.status(500).json({ error: 'Erro ao cancelar consulta' });
    }
}

// ── DOCTOR: listar TODAS as consultas (read-only para visualização geral) ─────

export async function getTodasConsultas(req, res) {
    try {
        const query = `
            SELECT
                c.id,
                c.data_hora,
                c.duracao_minutos,
                c.motivo,
                c.status,
                c.observacoes,
                c.criado_em,
                c.atualizado_em,
                p.nome AS paciente_nome,
                p.email AS paciente_email,
                m.nome AS medico_nome,
                m.especialidade AS medico_especialidade,
                m.id AS medico_id
            FROM consultas c
            JOIN usuarios p ON c.paciente_id = p.id
            JOIN usuarios m ON c.medico_id = m.id
            ORDER BY c.data_hora DESC
        `;
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (error) {
        console.error('Erro em getTodasConsultas:', error);
        return res.status(500).json({ error: 'Erro ao buscar consultas' });
    }
}

// ── DOCTOR: listar só as consultas dele ───────────────────────────────────────

export async function getMinhasConsultasDoctor(req, res) {
    try {
        const medicoId = req.usuario.id;
        const query = `
            SELECT
                c.id,
                c.data_hora,
                c.duracao_minutos,
                c.motivo,
                c.status,
                c.observacoes,
                c.criado_em,
                c.atualizado_em,
                p.nome AS paciente_nome,
                p.email AS paciente_email
            FROM consultas c
            JOIN usuarios p ON c.paciente_id = p.id
            WHERE c.medico_id = $1
            ORDER BY c.data_hora DESC
        `;
        const result = await db.query(query, [medicoId]);
        return res.json(result.rows);
    } catch (error) {
        console.error('Erro em getMinhasConsultasDoctor:', error);
        return res.status(500).json({ error: 'Erro ao buscar consultas' });
    }
}

// ── DOCTOR: editar APENAS suas próprias consultas ─────────────────────────────

export async function editarConsultaDoctor(req, res) {
    try {
        const medicoId = req.usuario.id;
        const id = Number(req.params.id);
        const { status, observacoes, data_hora, duracao_minutos } = req.body;

        // Verifica se a consulta pertence a esse médico
        const busca = await db.query(
            'SELECT * FROM consultas WHERE id = $1 AND medico_id = $2',
            [id, medicoId]
        );

        if (busca.rows.length === 0) {
            return res.status(403).json({ error: 'Você não tem permissão para editar esta consulta' });
        }

        const consulta = busca.rows[0];

        // Se está tentando mudar data/hora, verifica conflitos
        if (data_hora && data_hora !== consulta.data_hora) {
            const duracao = duracao_minutos || consulta.duracao_minutos;
            const conflitoMedico = await verificarConflitoMedico(medicoId, data_hora, duracao, id);
            if (conflitoMedico) {
                return res.status(409).json({ error: 'Você já tem uma consulta neste horário' });
            }
        }

        const query = `
            UPDATE consultas
            SET
                status = COALESCE($1, status),
                observacoes = COALESCE($2, observacoes),
                data_hora = COALESCE($3::timestamp, data_hora),
                duracao_minutos = COALESCE($4, duracao_minutos)
            WHERE id = $5 AND medico_id = $6
            RETURNING *
        `;
        const result = await db.query(query, [status, observacoes, data_hora || null, duracao_minutos || null, id, medicoId]);

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro em editarConsultaDoctor:', error);
        return res.status(500).json({ error: 'Erro ao editar consulta' });
    }
}

// ── DOCTOR: buscar consulta por ID ────────────────────────────────────────────

export async function getConsultaPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const query = `
            SELECT
                c.*,
                p.nome AS paciente_nome,
                p.email AS paciente_email,
                m.nome AS medico_nome,
                m.especialidade AS medico_especialidade
            FROM consultas c
            JOIN usuarios p ON c.paciente_id = p.id
            JOIN usuarios m ON c.medico_id = m.id
            WHERE c.id = $1
        `;
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro em getConsultaPorId:', error);
        return res.status(500).json({ error: 'Erro ao buscar consulta' });
    }
}