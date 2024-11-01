import express, {Express, Request, Response} from 'express'
import rootRouter from './routes/indexRoutes'
import { PORT } from './secret'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'
import { SignUpSchema } from './schema/users'

const app:Express = express()

app.use(express.json())

app.get("/", (req:Request, res:Response) => {
    res.send("Working...")
})
app.use("/api", rootRouter)
app.use(errorMiddleware)

export const prismaClient = new PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    postcode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country} - ${addr.postcode}`
                }
            }
        }
    }
})

app.listen(PORT, () => {
    console.log("App is working.. ")
})