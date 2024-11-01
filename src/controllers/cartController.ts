import { CartItem, Product } from "@prisma/client"
import { Request, Response } from "express"
import { prismaClient } from ".."
import { BadRequestsException, NotFoundException, UnauthorizedException } from "../exceptions/httpRequests"
import { ErrorCode, StatusCode } from "../exceptions/root"
import { CreateCartSchema } from "../schema/cart"

export const addItemToCart = async(req:Request, res:Response) => {
    const validateData = CreateCartSchema.parse(req.body)
    let product: Product
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {id: validateData.productId}
        })
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
    }

    // This code is written to check if the userId we are passibg in the data field is defined 
    if(!req.user?.id){
        throw new UnauthorizedException("This user does not exist", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.FORBIDDEN)
    }
    const productExist = await prismaClient.cartItem.findFirst({
        where: {productId: product.id}
    })
    if(productExist){
        productExist.quantity++
    }else{
        const cart = await prismaClient.cartItem.create({
            data: {
                userId: req.user?.id,
                productId: product.id,
                quantity: validateData.quantity
            }
        })
        res.json(cart)
    }
}

export const deleteItemFromCart = async(req:Request, res:Response) => {
    // Todo check if user is deleting its own cart Item
    let user = await prismaClient.cartItem.findFirst({
        where: {userId: req.user?.id}
    })
    if(user){
        await prismaClient.cartItem.delete({
            where: {
                id: +req.params.id,
            }
        })
        res.json({message: "Product has been deleted successfuly from cart"})
    }else{
        throw new UnauthorizedException("You are not allowed to delete this product", ErrorCode.UNAUTHORIZED_EXCEPTION, StatusCode.FORBIDDEN)
    }
}
// export const changeQuantity = async(req:Request, res:Response) => {
//     const validateData = changeQuatitySchema.parse(req.body)
//     const updatedCart = await prismaClient.cartItem.update({
//         where: {
//             id: +req.params.id
//         },
//         data: {
//             quantity: validateData.quantity
//         }
//     })
//     res.json(updatedCart)
// }

export const getCart = async(req:Request, res:Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user?.id
        },
        include:{
            product: true
        }
    })
    res.json(cart)
}