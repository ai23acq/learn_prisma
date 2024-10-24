import express, {Express, Request, Response} from 'express'
import rootRouter from './routes/indexRoutes'
import { PORT } from './secret'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'

const app:Express = express()

app.use(express.json())

app.get("/", (req:Request, res:Response) => {
    res.send("Working...")
})
app.use("/api", rootRouter)
app.use(errorMiddleware)

export const prismaClient = new PrismaClient({
    log: ['query']
})

app.listen(PORT, () => {
    console.log("App is working.. ")
})