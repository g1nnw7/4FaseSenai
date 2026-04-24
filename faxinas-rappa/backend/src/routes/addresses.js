const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AdressController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, AddressController.index);
router.post('/', authenticate, AddressController.create);
router.delete('/:id', authenticate, AddressController.delete);

module.exports = router;