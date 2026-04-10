import db from "../config/db.js";
import bcrypt from "bcrypt";

export async function getTodosOsUsuarios(req, res) {
    try {
        const query = 'SELECT id, nome, email, role FROM usuarios ORDER BY id ASC';
        const result = await db.query(query);
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
        const result = await db.query(query, [id]);

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
        const result = await db.query(query, [email]);

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

        const result = await db.query(query, values);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        if (error.code === "23505") {
            return res.status(400).send("Falha ao cadastrar usuário: Email já cadastrado!");
        }
        return res.status(500).send("Erro inesperado no servidor");
    }
}

export const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body;
    
    try {
        if (senha && senha.trim() !== '') {
            const hash = await bcrypt.hash(senha, 10);
            const query = 'UPDATE usuarios SET nome=$1, email=$2, senha=$3, role=$4 WHERE id=$5';
            await db.query(query, [nome, email, hash, role, id]);
        } else {
            const query = 'UPDATE usuarios SET nome=$1, email=$2, role=$3 WHERE id=$4';
            await db.query(query, [nome, email, role, id]);
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        console.error("ERRO NO BANCO:", error); 
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

export async function deletarUsuario(req, res) {
    try {
        const id = Number(req.params.id);
        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email';
        const result = await db.query(query, [id]);

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