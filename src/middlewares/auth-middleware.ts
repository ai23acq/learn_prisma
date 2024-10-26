import {Request, Response, NextFunction} from 'express'
import { UnauthorizedException } from '../exceptions/httpRequests'
import { ErrorCode, StatusCode } from '../exceptions/root'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secret'
import { prismaClient } from '..'

const authMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    // 1. extract the token from the header
    const token = req.headers.authorization as string
    // 2. if token is not present, throw an error of unauthorized
    if(!token){
        return next(new UnauthorizedException("unatorized! No Token", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.UNAUTHORIZED))
    }
    try {
        // 3. if the token is present, verify the token and extract the payload
        const payload = jwt.verify(token, JWT_SECRET) as {userId: number}
        // 4. get the user from the payload
        const user = await prismaClient.user.findFirst({where: {id: payload.userId}})
        if(!user){
           return next(new UnauthorizedException("unatorized! No Token", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.UNAUTHORIZED))
        }
        // 5. attach the user to the current request object
        req.user = user
        next()
    } catch (error) {
        next(new UnauthorizedException("unatorized! No Token", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.UNAUTHORIZED))
    }
}

export default authMiddleware