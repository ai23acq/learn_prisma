import { Router } from "express";
import authRoutes from "./userroutes";

const rootRouter:Router = Router()

rootRouter.use("/user", authRoutes)

export default rootRouter