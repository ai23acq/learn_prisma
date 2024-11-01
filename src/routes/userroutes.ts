import { Router } from "express";
import { signup, login, getMe, addAddress, listAddresses, deleteAddress, changeUserRole, listUsers, getUserById } from "../controllers/userController";
import adminMiddleware from "../middlewares/admin-middleware";
import authMiddleware from "../middlewares/auth-middleware";
import { errorHandler } from "../middlewares/error-handler";

const authRoutes:Router = Router()

authRoutes.post("/signup", errorHandler(signup))
authRoutes.post("/login", errorHandler(login))
authRoutes.get('/me', authMiddleware, errorHandler(getMe))
authRoutes.post('/address', authMiddleware, errorHandler(addAddress))
authRoutes.get('/address', authMiddleware, errorHandler(listAddresses))
authRoutes.put("/allusers", authMiddleware, adminMiddleware, errorHandler(listUsers))
authRoutes.put("/:id", authMiddleware, adminMiddleware, errorHandler(getUserById))
authRoutes.put("/:id/role", authMiddleware, adminMiddleware, errorHandler(changeUserRole))
authRoutes.delete('/address/:id', authMiddleware, errorHandler(deleteAddress))

export default authRoutes