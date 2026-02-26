import { Router } from 'express';
const router = Router();

import { getProdutos, adicionarProduto, editarProduto, deletarProduto } from '../controllers/produtoController.js';

router.get('/produto', getProdutos);
router.post('/produto', adicionarProduto);
router.patch('/produto/:id', editarProduto);
router.delete('/produto/:id', deletarProduto);



export default router;