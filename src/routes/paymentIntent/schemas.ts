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
})

export const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
})

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.string(),
  amount: z.number(),
  status: z.string(),
  paymentIntentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export type Payment = z.infer<typeof PaymentSchema>
export type Order = z.infer<typeof OrderSchema>
