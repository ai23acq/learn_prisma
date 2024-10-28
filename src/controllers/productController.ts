import { NextFunction, Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/httpRequests"
import { ErrorCode, StatusCode } from "../exceptions/root"
import { CreateProductSchema } from "../schema/products"

export const createProduct = async(req:Request, res:Response, ) => {  
    CreateProductSchema.parse(req.body)

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(","),
            createdBy: req.user?.id
        }
    })

    return res.json(product)
}

export const updateProduct = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const product = req.body
        if(product.tags){
            product.tags = product.tags.join(",")
        }
        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            }, 
            data: product
        })
        res.json(updatedProduct)
    } catch (error) {
        next(new NotFoundException("Product not found!", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND))
    }
}

export const deleteProduct = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            }, 
        })
        if(deletedProduct){
            res.json({message: "Product deleted successfully"})
        }
    } catch (error) {
        next(new NotFoundException("Product not found!", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND))
    }
}

export const listProducts = async(req:Request, res:Response) => {
    // This is pagination from backend
    const skip = parseInt(req.query.skip?.toString() ?? '0');
    // const limit = parseInt(req.query.limit?.toString() ?? '10');
    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip,
        take: 5, //you can actually pass limit here
        where: {
            createdBy: req.user?.id
        },
    })
    res.json({count, products})
}

export const getSingleProduct = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product)
    } catch (error) {
        next(new NotFoundException("Product not found!", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND))
    }
}