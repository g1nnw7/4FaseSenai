const express = require('express');
const { verificarToken, ehAdmin } = require('./middlewares/autenticacao');
const usuarioController = require('./controller/usuarioController');
const consultaController = require('./controller/consultaController');

const routes = express.Router();

routes.post('/usuarios', usuarioController.criar);
routes.post('/consultas', verificarToken, consultaController.criar);

routes.get('/admin/usuarios', verificarToken, ehAdmin, usuarioController.listarTodos);
routes.put('/admin/usuarios/:id', verificarToken, ehAdmin, usuarioController.atualizar);
routes.delete('/admin/usuarios/:id', verificarToken, ehAdmin, usuarioController.deletar);
routes.get('/admin/consultas', verificarToken, ehAdmin, consultaController.buscarTodasParaAdmin);

module.exports = routes;
