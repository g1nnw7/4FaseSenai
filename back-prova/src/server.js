const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createPool({
host: 'localhost',
user: 'root', 
password: 'senai', 
database: 'prova_db'
});


app.post('/api/cadastro', async (req, res) => {
const { cpf, senha } = req.body;
try {
const query = 'INSERT INTO usuarios (cpf, senha) VALUES (?, ?)';
await db.query(query, [cpf, senha]);

res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
} catch (error) {
res.status(500).json({ error: 'Erro ao cadastrar. cpf já existe?' });
}
});

app.post('/api/login', async (req, res) => {
const { cpf, senha } = req.body;
try {
const query = 'SELECT * FROM usuarios WHERE cpf = ? AND senha = ?';
const [rows] = await db.query(query, [cpf, senha]);

if (rows.length === 0) {
return res.status(401).json({ error: 'cpf ou senha incorretos' });
}

const usuario = rows[0];
res.json({ message: 'Login realizado com sucesso!', userId: usuario.id });
} catch (error) {
res.status(500).json({ error: 'Erro no servidor' });
}
});

app.listen(3000, () => console.log('Back-end ON na porta 3000 (Simples e direto)'));