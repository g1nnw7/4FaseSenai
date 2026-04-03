import 'dotenv/config';
import express from "express";
import cors from "cors";
import { usuarioRouter } from './src/routes/usuario.js';
import { authRouter } from './src/routes/auth.js';
import produtoRouter  from './src/routes/produto.js';

export const app = express();

app.use(cors());
app.use(express.json());


app.use(authRouter);
app.use(usuarioRouter);
app.use(produtoRouter);

export default app;