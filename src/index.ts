import express, {Express, Request, Response} from 'express'
import rootRouter from './routes/indexRoutes'
import { PORT } from './secret'

const app:Express = express()

app.get("/", (req:Request, res:Response) => {
    res.send("Working...")
})
app.use("/api", rootRouter)

app.listen(PORT, () => {
    console.log("App is working.. ")
})