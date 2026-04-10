import db from "../config/db.js";
import bcrypt from "bcrypt";

export async function getTodosOsUsuarios(req, res) {
    try {
        const query = 'SELECT id, nome, cpf, role FROM usuarios ORDER BY id ASC';
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
        const query = 'SELECT id, nome, cpf, role FROM usuarios WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Usuário não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getUsuarioPorId:", e);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
}

export async function getUsuarioPorcpf(req, res) {
    try {
        const cpf = String(req.query.cpf);
        const query = 'SELECT id, nome, cpf, role FROM usuarios WHERE cpf = $1';
        const result = await db.query(query, [cpf]);

        if (result.rows.length === 0) return res.status(404).send("Usuário não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getUsuarioPorcpf:", e);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
}

export async function criarUsuario(req, res) {
    try {
        const { nome, cpf, senha } = req.body;
        const salt = 10;
        const senhaHashed = await bcrypt.hash(senha, salt);

        const query = `
            INSERT INTO usuarios (nome, cpf, senha, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, nome, cpf, role
        `;
        const values = [nome, cpf, senhaHashed, 'USER'];

        const result = await db.query(query, values);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        if (error.code === "23505") {
            return res.status(400).send("Falha ao cadastrar usuário: cpf já cadastrado!");
        }
        return res.status(500).send("Erro inesperado no servidor");
    }
}

export const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, senha, role } = req.body;
    
    try {
        if (senha && senha.trim() !== '') {
            const hash = await bcrypt.hash(senha, 10);
            const query = 'UPDATE usuarios SET nome=$1, cpf=$2, senha=$3, role=$4 WHERE id=$5';
            await db.query(query, [nome, cpf, hash, role, id]);
        } else {
            const query = 'UPDATE usuarios SET nome=$1, cpf=$2, role=$3 WHERE id=$4';
            await db.query(query, [nome, cpf, role, id]);
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
        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, cpf';
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