import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/httpRequests";
import { ErrorCode, StatusCode } from "../exceptions/root";
import { AddressWithFormatted } from "../types/address";

export const createOrder = async(req:Request, res:Response) => {
    /**
     * to create a transaction
     * to list all the cart items and proceed if cart is not empty
     * calculate the total amount
     * fetch address of user
     * to define. computed field for formatted address on address module
     * we will create an order and order products
     * create event
     */
    return await prismaClient.$transaction(async(tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user?.id
            },
            include: {
                product: true
            }
        })
        if(cartItems.length == 0){
            res.json({message: "Cart is empty"})
            return
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0)
        const defaultShippingAddressId = req.user?.defaultShippingAddress
        if (defaultShippingAddressId == null) {  // Handles both null and undefined cases
            throw new NotFoundException("Default shipping address is not set for the user", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND);
        }
        const address = await tx.address.findFirst({
            where: {
                id: defaultShippingAddressId
            }
        });
        
        if (!address) {
            throw new NotFoundException("Address not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND);
        }
        
        // Compute `formattedAddress` dynamically
        const formattedAddress = `${address.lineOne}, ${address.lineTwo || ''}, ${address.city}, ${address.country} - ${address.postcode}`;

        const order = await tx.order.create({
            data: {
                user: { connect: { id: req.user?.id } },
                netAmount: price,
                address: formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return{
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })
        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        })
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user?.id
            }
        })
        return res.json(order)
    })
}

export const listOrders = async(req:Request, res:Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId : req.user?.id
        }
    })
    res.json(orders)
}

export const cancelOrder = async(req:Request, res:Response) => {
    //1. Wrap inside transaction
    //2. Check if the user is the one cancelling the order
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: "CANCELED"
            }
        })
        await prismaClient.order.create({
            data: {
                orderId: order.id,
                status: "CANCELED"
            }
        })
        res.json(order)
    } catch (error) {
        throw new NotFoundException("Order not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
    }
}

export const getOrderById = async(req:Request, res:Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })
        res.json(order)
    } catch (error) {
        throw new NotFoundException("Order not found", ErrorCode.USER_NOT_FOUND, StatusCode.NOT_FOUND)
    }
}