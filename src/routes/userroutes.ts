import { Router } from "express";
import { signup, login, getMe } from "../controllers/userController";
import authMiddleware from "../middlewares/auth-middleware";
import { errorHandler } from "../middlewares/error-handler";

const authRoutes:Router = Router()

authRoutes.post("/signup", errorHandler(signup))
authRoutes.post("/login", errorHandler(login))
authRoutes.get('/me', authMiddleware, errorHandler(getMe))

export default authRoutes