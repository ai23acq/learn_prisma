import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt"
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secret";
import { BadRequestsException, NotFoundException, UnprocessableException } from "../exceptions/httpRequests";
import { ErrorCode, StatusCode } from "../exceptions/root";
import { AddressSchema, SignUpSchema, UpdateUserSchema } from "../schema/users";
import { Address, User } from "@prisma/client";

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
    const user = req.user as any
    res.json(user)
}

export const addAddress = async(req:Request, res:Response) => {
    AddressSchema.parse(req.body)

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user?.id
        }
    })
    res.json(address)
}
export const deleteAddress = async(req:Request, res:Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json({message: "Address removed successfully"})
    } catch (error) {
        throw new NotFoundException("Address not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
    }
}
export const listAddresses = async(req:Request, res:Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user?.id
        }
    })
    res.json(addresses)
}

export const updateUser = async(req:Request, res:Response) => {
    const validateData = UpdateUserSchema.parse(req.body)
    let shippingAddress: Address | undefined
    let billingAddress: Address | undefined
    if(validateData.defaultShippingAddress){
        try{
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validateData.defaultShippingAddress
                }
            })
        }catch(err){
            throw new NotFoundException("Address not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
        }
        if(shippingAddress.userId != req.user?.id){
            throw new BadRequestsException("Address does not belong to this user", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.FORBIDDEN)
        }
    }
    if(validateData.defaultBillingAddress){
        try{
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validateData.defaultBillingAddress
                }
            })
        }catch(err){
            throw new NotFoundException("Address not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
        }
        if(billingAddress.userId != req.user?.id){
            throw new BadRequestsException("Address does not belong to this user", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.FORBIDDEN)
        }
    }

    //use this to filter out any null or undefined values from validateData
    const filteredData = Object.fromEntries(
        Object.entries(validateData).filter(([_, v]) => v !== undefined && v !== null)
    );

    const updatedUser = await prismaClient.user.update({
        where: { id: req.user?.id },
        data: filteredData
    })
    res.json(updatedUser)
}