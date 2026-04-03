import { Router } from "express";
import { fazerLogin } from "../controller/authController.js";

export const authRouter = Router()

authRouter.post("/login", fazerLogin)