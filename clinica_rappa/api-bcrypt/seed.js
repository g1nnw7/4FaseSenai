import 'dotenv/config'; 
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pkg;

async function popularBanco() {
    console.log('🌱 Iniciando o seed do banco de dados...');

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        // --- 1. Criar Usuário Admin ---
        const senhaHash = await bcrypt.hash('admin123', 10);
        const queryAdmin = `
            INSERT INTO usuarios (nome, cpf, senha, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (cpf) DO NOTHING;
        `;
        await client.query(queryAdmin, ['Administrador Master', 'admin@rappa.com', senhaHash, 'ADMIN']);
        console.log('✅ Verificação de Admin concluída.');

    } catch (error) {
        console.error('❌ Erro ao rodar o seed:', error);
    } finally {
        await client.end();
        console.log('🔌 Conexão encerrada.');
    }
}

popularBanco();