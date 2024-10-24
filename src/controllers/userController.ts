import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt"
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secret";
import { BadRequestsException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";

export const signup = async(req:Request, res:Response, next:NextFunction) => {
    const {name, email, password} = req.body
    let userExist = await prismaClient.user.findFirst({where: {email}})
    if(userExist){
        // throw Error("User already exists!")
        next(new BadRequestsException("User already exists", ErrorCode.USER_ALREADY_EXISTS))
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
        next(new BadRequestsException("User not found", ErrorCode.USER_NOT_FOUND))
    }
    if(!compareSync(password, userExists.password)){
        next(new BadRequestsException("Incorrect password", ErrorCode.INCORRECT_PASSWORD))
    }
    const token = jwt.sign({
        userId: userExists.id
    }, JWT_SECRET)
    res.json({userExists, token})
}