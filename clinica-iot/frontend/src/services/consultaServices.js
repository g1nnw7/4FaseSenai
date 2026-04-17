import api from '../api';

// USER
export const getMinhasConsultas = () => api.get('/consultas/minhas');
export const agendarConsulta = (dados) => api.post('/consultas', dados);
export const cancelarConsulta = (id) => api.delete(`/consultas/${id}`);

// DOCTOR - painel admin
export const getTodasConsultas = () => api.get('/admin/consultas');
export const getMinhasConsultasDoctor = () => api.get('/admin/consultas/minhas');
export const getConsultaPorId = (id) => api.get(`/admin/consultas/${id}`);
export const editarConsulta = (id, dados) => api.put(`/admin/consultas/${id}`, dados);