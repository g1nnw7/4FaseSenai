import { Router } from 'express';
import { login, register, getMe } from '../controller/authController.js';
import { autenticarToken } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/register', register);
authRouter.get('/auth/me', autenticarToken, getMe);