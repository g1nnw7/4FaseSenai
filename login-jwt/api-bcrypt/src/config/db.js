import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

// O Pool gerencia as conexões com o Postgres automaticamente
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('📦 Conectado ao banco de dados PostgreSQL!');
});
