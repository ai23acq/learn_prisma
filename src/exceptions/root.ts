// creating message, status code, error code and error

export class HttpException extends Error{
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message:string, errorCode:ErrorCode, statusCode:StatusCode, errors:any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}

export enum StatusCode{
    CREATE_SUCCESSFUL= 200,
    UPDATE_SUCCESSFUL = 201,
    NOT_FOUND = 404,
    FORBIDDEN = 403,
    UNAUTHORIZED = 401,
    INTERNAL_SERVER_ERROR = 500
}

export enum ErrorCode{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    FAILED_REQUEST = 2001,
    UNAUTHORIZED_EXCEPTION = 4001,
    INTERNAL_EXCEPTION = 5001,
}