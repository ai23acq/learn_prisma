import { User } from "@prisma/client";
import express, {Express, Request} from 'express'

declare global{
    namespace Express{
        interface Request{
            user?: User
        }
    }
}