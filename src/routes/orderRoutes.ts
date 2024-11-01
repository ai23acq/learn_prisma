import { Router } from "express";
import { errorHandler } from "../middlewares/error-handler";
import authMiddleware from "../middlewares/auth-middleware";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/orderController";
import adminMiddleware from "../middlewares/admin-middleware";

const orderRoutes:Router = Router()

orderRoutes.post("/", authMiddleware, errorHandler(createOrder))
orderRoutes.get("/", authMiddleware, errorHandler(listOrders))
orderRoutes.get("/index", authMiddleware, adminMiddleware, errorHandler(listAllOrders))
orderRoutes.get("/users/:id", authMiddleware, adminMiddleware, errorHandler(listUserOrders))
orderRoutes.get("/:id/status", authMiddleware, adminMiddleware, errorHandler(changeStatus))
orderRoutes.put("/:id/cancel", authMiddleware, errorHandler(cancelOrder))
orderRoutes.post("/:id", authMiddleware, errorHandler(getOrderById))

export default orderRoutes