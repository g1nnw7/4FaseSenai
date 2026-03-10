import 'dotenv/config';
import express from "express";
import cors from "cors";
import { usuarioRouter } from './src/routes/usuario.js';
import { authRouter } from './src/routes/auth.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(usuarioRouter);

export default app;