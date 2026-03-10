import { Router } from "express";
import { getTodosOsUsuarios, getUsuarioPorId, criarUsuario, atualizarUsuario, deletarUsuario, } from "../controller/usuarioController.js";

export const usuarioRouter = Router();

usuarioRouter.get("/usuarios", getTodosOsUsuarios);
usuarioRouter.get("/usuarios/:id", getUsuarioPorId);
usuarioRouter.post("/usuarios", criarUsuario);
usuarioRouter.put("/usuarios/:id", atualizarUsuario);
usuarioRouter.delete("/usuarios/:id", deletarUsuario);