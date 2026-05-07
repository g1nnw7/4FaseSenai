// src/servidor.js
const express = require('express');
const cors = require('cors');
const rotas = require('./src/app.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', rotas);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000 🚀');
});