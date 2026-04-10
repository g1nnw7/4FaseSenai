import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function fazerLogin(req, res) {
    try {
        const { email, senha } = req.body;

        // 1. Busca o usuário no banco usando SQL
        const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0]; // Pega o primeiro resultado

        if (!usuario) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

        // 2. Compara a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

        // 3. Gera o Token JWT
        const token = jwt.sign(
            { id: usuario.id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token: token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                role: usuario.role
            }
        });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}