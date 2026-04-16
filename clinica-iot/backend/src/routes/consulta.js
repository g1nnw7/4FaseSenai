import { Router } from 'express';
import {
    getMinhasConsultas,
    agendarConsulta,
    cancelarConsultaUser,
    getTodasConsultas,
    getMinhasConsultasDoctor,
    editarConsultaDoctor,
    getConsultaPorId,
} from '../controller/consultaController.js';
import { autenticarToken, apenasDoctor } from '../middleware/auth.js';

export const consultaRouter = Router();

// ── USER + DOCTOR: rotas de paciente ─────────────────────────────────────────
// Tanto USER quanto DOCTOR podem agendar/ver suas próprias consultas como paciente
consultaRouter.get('/consultas/minhas', autenticarToken, getMinhasConsultas);
consultaRouter.post('/consultas', autenticarToken, agendarConsulta);
consultaRouter.delete('/consultas/:id', autenticarToken, cancelarConsultaUser);

// ── DOCTOR: painel administrativo ────────────────────────────────────────────
// Visualizar todas as consultas (read-only)
consultaRouter.get('/admin/consultas', autenticarToken, apenasDoctor, getTodasConsultas);

// Consultas próprias do médico (editáveis)
consultaRouter.get('/admin/consultas/minhas', autenticarToken, apenasDoctor, getMinhasConsultasDoctor);
consultaRouter.get('/admin/consultas/:id', autenticarToken, apenasDoctor, getConsultaPorId);
consultaRouter.put('/admin/consultas/:id', autenticarToken, apenasDoctor, editarConsultaDoctor);