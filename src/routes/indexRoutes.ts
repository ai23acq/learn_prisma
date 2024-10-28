import { Router } from "express";
import cartRoutes from "./cartRoutes";
import productRoutes from "./productRoutes";
import authRoutes from "./userroutes";

const rootRouter:Router = Router()

rootRouter.use("/user", authRoutes)
rootRouter.use("/product", productRoutes)
rootRouter.use("/cart", cartRoutes)

export default rootRouter