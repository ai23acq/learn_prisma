import dotenv from 'dotenv'
// import path from 'path'

dotenv.config({path: '.env'})

export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET!