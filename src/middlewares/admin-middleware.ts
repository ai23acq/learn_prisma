import {Request, Response, NextFunction} from 'express'
import { UnauthorizedException } from '../exceptions/httpRequests'
import { ErrorCode, StatusCode } from '../exceptions/root'


const adminMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    const user = req.user
    if(user?.role == "ADMIN"){
        next()
    }else{
        next(new UnauthorizedException("unatorized! No Token", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.UNAUTHORIZED))
    }
}

export default adminMiddleware