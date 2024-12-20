import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { BadRequestsException, InternalException } from "../exceptions/httpRequests"
import { ErrorCode, HttpException, StatusCode } from "../exceptions/root"

export const errorHandler = (method: Function) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req,res,next)
        } catch (error) {
            let exception: HttpException;
            if(error instanceof HttpException){
                exception = error
            }else if(error instanceof ZodError) {
                exception = new BadRequestsException("Fields not complete", ErrorCode.FAILED_REQUEST, StatusCode.FORBIDDEN)
            }else{
                exception = new InternalException('Something went wrong', error, ErrorCode.INTERNAL_EXCEPTION, StatusCode.INTERNAL_SERVER_ERROR)
            }
            next(exception)
        }
    }
}