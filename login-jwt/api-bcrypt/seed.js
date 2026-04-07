import 'dotenv/config'; // Puxa a url do banco do .env
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Client } = pkg;

async function popularBanco() {
    console.log('🌱 Iniciando o seed do banco de dados (SQL Puro)...');

    // Conecta no banco usando a mesma URL do seu .env
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        // 1. Gera o hash da senha do Admin
        const senhaHash = await bcrypt.hash('admin123', 10);

        // 2. Cria a query de inserção
        // O "ON CONFLICT (email) DO NOTHING" garante que se você rodar o seed 2 vezes, ele não vai dar erro de e-mail duplicado
        const query = `
            INSERT INTO usuarios (nome, email, senha, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, nome, email;
        `;
        
        const values = ['Administrador Master', 'admin@rappa.com', senhaHash, 'ADMIN'];

        // 3. Executa a query
        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            console.log(`✅ Usuário ADMIN criado com sucesso! Email: ${result.rows[0].email}`);
        } else {
            console.log(`✅ Tudo certo! O usuário ADMIN já existia no banco. Nenhuma duplicata foi gerada.`);
        }

    } catch (error) {
        console.error('❌ Erro ao rodar o seed:', error);
    } finally {
        // Encerra a conexão para o terminal não ficar travado
        await client.end();
        console.log('🔌 Conexão encerrada.');
    }
}

popularBanco();