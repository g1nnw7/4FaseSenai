import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const usuario = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            status: usuario.status,
            especialidade: usuario.especialidade,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        return res.status(200).json({
            token,
            usuario: payload,
        });
    } catch (error) {
        console.error('Erro em login:', error);
        return res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
}

export async function register(req, res) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        }

        const senhaHashed = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO usuarios (nome, email, senha, role)
            VALUES ($1, $2, $3, 'USER')
            RETURNING id, nome, email, role
        `;
        const result = await db.query(query, [nome, email, senhaHashed]);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro em register:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
}

export async function getMe(req, res) {
    try {
        const query = 'SELECT id, nome, email, role, status, especialidade FROM usuarios WHERE id = $1';
        const result = await db.query(query, [req.usuario.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro em getMe:', error);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
}