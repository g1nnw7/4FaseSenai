import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'rappa_clinic',
});

db.connect()
    .then(() => console.log('✅ PostgreSQL conectado com sucesso!'))
    .catch(err => console.error('❌ Erro ao conectar no PostgreSQL:', err));

export default db;