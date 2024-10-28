import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().optional(),
    city: z.string(),
    country: z.string(),
    postcode: z.string().optional(),
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddress: z.string().optional(),
    defaultBillingAddress: z.string().optional()
})