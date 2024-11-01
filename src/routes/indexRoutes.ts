import { Router } from "express";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import productRoutes from "./productRoutes";
import authRoutes from "./userroutes";

const rootRouter:Router = Router()

rootRouter.use("/user", authRoutes)
rootRouter.use("/product", productRoutes)
rootRouter.use("/cart", cartRoutes)
rootRouter.use("/orders", orderRoutes)

export default rootRouter