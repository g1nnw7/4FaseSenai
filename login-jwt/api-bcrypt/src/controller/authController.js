import { prismaClient } from "../../prisma/prisma.js"; // Ajuste o caminho se necessário
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function fazerLogin(req, res) {
    try {
        const { email, senha } = req.body;

        const usuario = await prismaClient.usuario.findUnique({
            where: { email: email }
        });
        if (!usuario) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou senha incorretos." });
        }

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