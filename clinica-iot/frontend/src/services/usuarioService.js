import api from '../api';

export const getTodosMedicos = () => api.get('/medicos');
export const getMedicosDisponiveis = () => api.get('/medicos/disponiveis');
export const atualizarStatusMedico = (status) => api.patch('/medicos/status', { status });
export const getTodosUsuarios = () => api.get('/usuarios');