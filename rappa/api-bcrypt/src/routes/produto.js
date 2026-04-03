import { Router } from 'express';
import { 
    listarProdutos, 
    criarProduto, 
    excluirProduto, 
    atualizarProduto 
} from '../controller/produtoController.js'; // Verifique se o caminho está correto

const produtoRouter = Router();

produtoRouter.get('/produtos', listarProdutos);
produtoRouter.post('/produtos', criarProduto);
produtoRouter.put('/produtos/:id', atualizarProduto);
produtoRouter.delete('/produtos/:id', excluirProduto);

export default produtoRouter;