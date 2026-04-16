import { Router } from 'express';
import {
    getTodosMedicos,
    getMedicosDisponiveis,
    atualizarStatusMedico,
    getTodosUsuarios,
    getUsuarioPorId,
} from '../controller/usuarioController.js';
import { autenticarToken, apenasDoctor } from '../middleware/auth.js';

export const usuarioRouter = Router();

// Público: listar médicos disponíveis (para agendar consulta)
usuarioRouter.get('/medicos', autenticarToken, getTodosMedicos);
usuarioRouter.get('/medicos/disponiveis', autenticarToken, getMedicosDisponiveis);

// DOCTOR: atualizar próprio status
usuarioRouter.patch('/medicos/status', autenticarToken, apenasDoctor, atualizarStatusMedico);

// DOCTOR: listar todos os usuários (painel admin)
usuarioRouter.get('/usuarios', autenticarToken, apenasDoctor, getTodosUsuarios);
usuarioRouter.get('/usuarios/:id', autenticarToken, apenasDoctor, getUsuarioPorId);