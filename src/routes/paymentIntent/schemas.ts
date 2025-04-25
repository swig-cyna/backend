import { z } from "@hono/zod-openapi"

export const PaymentSchema = z.object({
  id: z.number(),
  userId: z.string(),
  stripeCustomerId: z.string(),
  stripePaymentIntentId: z.string(),
  status: z.string(),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable(),
  quantity: z.number(),
})

export const CreatePaymentSchema = z.object({
  userId: z.string(),
  cartItems: z.array(z.object({ productId: z.number(), quantity: z.number() })),
  paymentMethodId: z.string(),
  shipping: z.object({
    address: z.object({
      line1: z.string(),
      line2: z.string().nullable(),
      city: z.string(),
      postal_code: z.string(),
      country: z.string().length(2),
    }),
    name: z.string().optional(),
  }),
})

export const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  shippingAddress: z.any(),
  billingAddress: z.any(),
})

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.string(),
  amount: z.number(),
  status: z.string(),
  paymentIntentId: z.string(),
  shipping_address: z.any(),
  billing_address: z.any(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export type Payment = z.infer<typeof PaymentSchema>
export type Order = z.infer<typeof OrderSchema>
