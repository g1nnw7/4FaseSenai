const express = require('express');
const router = express.Router();
const FaxinaController = require('../controllers/FaxinaController');
const { authenticate, requireAdmin, requireAdminOrClt } = require('../middlewares/auth');

// USER: suas faxinas
router.get('/my', authenticate, FaxinaController.myFaxinas);

// CLT: suas faxinas
router.get('/clt/my', authenticate, requireAdminOrClt, FaxinaController.myCltFaxinas);

// USER: agendar faxina
router.post('/', authenticate, FaxinaController.create);

// USER: cancelar faxina (regra 24h no controller)
router.patch('/:id/cancel', authenticate, FaxinaController.cancel);

// CLT: editar status/obs de sua faxina
router.patch('/:id/clt', authenticate, requireAdminOrClt, FaxinaController.cltUpdate);

// ADMIN: ver todas as faxinas
router.get('/', authenticate, requireAdmin, FaxinaController.index);

// ADMIN: ver e editar qualquer faxina
router.get('/:id', authenticate, FaxinaController.show);
router.put('/:id', authenticate, requireAdmin, FaxinaController.adminUpdate);

module.exports = router;