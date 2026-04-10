import { Router } from 'express';
import { 
    listarConsultas, 
    criarConsulta, 
    excluirConsulta, 
    atualizarConsulta 
} from '../controller/consultaController.js'; 

const consultaRouter = Router();

consultaRouter.get('/consultas', listarConsultas);
consultaRouter.post('/consultas', criarConsulta);
consultaRouter.put('/consultas/:id', atualizarConsulta);
consultaRouter.delete('/consultas/:id', excluirConsulta);

export default consultaRouter;