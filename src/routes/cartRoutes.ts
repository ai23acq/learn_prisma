import { Router } from "express";
import { addItemToCart, deleteItemFromCart, getCart } from "../controllers/cartController";
import authMiddleware from "../middlewares/auth-middleware";
import { errorHandler } from "../middlewares/error-handler";

const cartRoutes:Router = Router()

cartRoutes.post("/", authMiddleware, errorHandler(addItemToCart))
cartRoutes.get("/", authMiddleware, errorHandler(getCart))
cartRoutes.delete("/:id", authMiddleware, errorHandler(deleteItemFromCart))
// cartRoutes.put("/:id", authMiddleware, errorHandler(changeQuantity))

export default cartRoutes