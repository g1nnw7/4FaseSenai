import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
    user: 'postgres',       
    host: 'localhost',
    database: 'rappa_consulta',  
    password: 'senai',  
    port: 5432,
});


export default db;