import { Router } from "express";
import { errorHandler } from "../middlewares/error-handler";
import authMiddleware from "../middlewares/auth-middleware";
import { cancelOrder, createOrder, getOrderById, listOrders } from "../controllers/orderController";

const orderRoutes:Router = Router()

orderRoutes.post("/", authMiddleware, errorHandler(createOrder))
orderRoutes.get("/", authMiddleware, errorHandler(listOrders))
orderRoutes.put("/:id/cancel", authMiddleware, errorHandler(cancelOrder))
orderRoutes.post("/:id", authMiddleware, errorHandler(getOrderById))

export default orderRoutes