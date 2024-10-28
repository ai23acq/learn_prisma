import { Router } from "express";
import { createProduct, deleteProduct, getSingleProduct, listProducts, updateProduct } from "../controllers/productController";
import adminMiddleware from "../middlewares/admin-middleware";
import authMiddleware from "../middlewares/auth-middleware";
import { errorHandler } from "../middlewares/error-handler";

const productRoutes:Router = Router()

productRoutes.post("/", authMiddleware, adminMiddleware, errorHandler(createProduct))
productRoutes.get("/", authMiddleware, adminMiddleware, errorHandler(listProducts))
productRoutes.put("/:id", authMiddleware, adminMiddleware, errorHandler(updateProduct))
productRoutes.delete("/:id", authMiddleware, adminMiddleware, errorHandler(deleteProduct))
productRoutes.get("/:id", authMiddleware, adminMiddleware, errorHandler(getSingleProduct))

export default productRoutes