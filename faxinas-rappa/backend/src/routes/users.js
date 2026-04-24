const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, requireAdmin, requireAdminOrClt } = require('../middlewares/auth');

// Rotas para usuário logado
router.get('/me/profile', authenticate, UserController.updateSelf);
router.patch('/me/profile', authenticate, UserController.updateSelf);

// CLT: atualizar próprio status
router.patch('/me/status', authenticate, UserController.updateCltStatus);

// Listar CLTs disponíveis (qualquer autenticado)
router.get('/clts/available', authenticate, UserController.availableCLTs);

// ADMIN: gerenciar usuários
router.get('/', authenticate, requireAdmin, UserController.index);
router.get('/:id', authenticate, requireAdmin, UserController.show);
router.post('/clts', authenticate, requireAdmin, UserController.createClt);
router.post('/admins', authenticate, requireAdmin, UserController.createAdmin);
router.put('/:id', authenticate, requireAdmin, UserController.update);
router.delete('/:id', authenticate, requireAdmin, UserController.delete);

module.exports = router;    