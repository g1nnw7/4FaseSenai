import { Router } from 'express';
const router = Router();

import { getProdutos, editarProduto, adicionarProduto, excluirProduto } from '../controllers/produtoController.js';

router.get('/produto', getProdutos);
router.post('/produto', adicionarProduto);
router.patch('/produto/:id', editarProduto)
router.delete('/produto/:id', excluirProduto)


export default router;