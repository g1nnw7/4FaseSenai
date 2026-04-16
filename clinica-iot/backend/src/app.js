import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './src/routes/auth.js';
import { usuarioRouter } from './src/routes/usuario.js';
import { consultaRouter } from './src/routes/consulta.js';

export const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', clinic: 'RAPPA' }));

app.use(authRouter);
app.use(usuarioRouter);
app.use(consultaRouter);

// Handler para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler global de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🏥 RAPPA Clinic API rodando na porta ${PORT}`);
});

export default app;