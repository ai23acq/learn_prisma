import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt"
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secret";
import { BadRequestsException, NotFoundException, UnprocessableException } from "../exceptions/httpRequests";
import { ErrorCode, StatusCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";

export const signup = async(req:Request, res:Response, next:NextFunction) => {
    SignUpSchema.parse(req.body)
    const {name, email, password} = req.body
    let userExist = await prismaClient.user.findFirst({where: {email}})
    if(userExist){
        // throw Error("User already exists!")
        new BadRequestsException("User already exists", ErrorCode.USER_ALREADY_EXISTS, StatusCode.FORBIDDEN)
    }
    userExist = await prismaClient.user.create({
        data:{
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(userExist)
}

export const login = async(req:Request, res:Response, next:NextFunction) => {
    const {email, password} = req.body
    let userExists = await prismaClient.user.findFirst({where: {email}})
    if(!userExists){
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
    }
    if(!compareSync(password, userExists.password)){
        throw new BadRequestsException("Incorrect password", ErrorCode.INCORRECT_PASSWORD, StatusCode.FORBIDDEN)
    }
    const token = jwt.sign({
        userId: userExists.id
    }, JWT_SECRET)
    res.json({userExists, token})
}

export const getMe = async(req:Request, res:Response, next:NextFunction) => {
    
}