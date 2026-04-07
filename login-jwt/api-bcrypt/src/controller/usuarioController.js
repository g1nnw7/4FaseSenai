import { pool } from "../config/db.js"; 
import bcrypt from "bcrypt";

export async function getTodosOsUsuarios(req, res) {
    try {
        const query = 'SELECT id, nome, email, role FROM usuarios ORDER BY id ASC';
        const result = await pool.query(query);
        return res.json(result.rows);
    } catch (e) {
        console.error("Erro em getTodosOsUsuarios:", e);
        return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
}

export async function getUsuarioPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const query = 'SELECT id, nome, email, role FROM usuarios WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Usuário não existe!");
        
        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getUsuarioPorId:", e);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
}

export async function getUsuarioPorEmail(req, res) {
    try {
        const email = String(req.query.email);
        const query = 'SELECT id, nome, email, role FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) return res.status(404).send("Usuário não existe!");
        
        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getUsuarioPorEmail:", e);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
}

export async function criarUsuario(req, res) {
    try {
        const { nome, email, senha } = req.body;
        const salt = 10;
        const senhaHashed = await bcrypt.hash(senha, salt);

        const query = `
            INSERT INTO usuarios (nome, email, senha, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, nome, email, role
        `;
        const values = [nome, email, senhaHashed, 'USER'];

        const result = await pool.query(query, values);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        if (error.code === "23505") {
            return res.status(400).send("Falha ao cadastrar usuário: Email já cadastrado!");
        }
        return res.status(500).send("Erro inesperado no servidor");
    }
}

export async function atualizarUsuario(req, res) {
    try {
        const id = Number(req.params.id);
        const { nome, email, role } = req.body;
        const query = `
            UPDATE usuarios 
            SET 
                nome = COALESCE($1, nome), 
                email = COALESCE($2, email), 
                role = COALESCE($3, role)
            WHERE id = $4
            RETURNING id, nome, email, role
        `;
        const values = [nome, email, role, id];
        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send("Usuário não existe no banco");
        }

        return res.status(200).json({
            message: "Usuário atualizado!",
            data: result.rows[0],
        });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if (error.code === "23505") {
            return res.status(400).send("Falha ao atualizar: Email já está em uso por outro usuário!");
        }
        return res.status(500).send("Erro inesperado no servidor");
    }
}

export async function deletarUsuario(req, res) {
    try {
        const id = Number(req.params.id);
        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Usuário não existe no banco");
        }

        return res.status(200).json({
            message: "Usuário deletado!",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).send("Erro inesperado no servidor");
    }
}