import { z } from "@hono/zod-openapi"

const AddressSchema = z.object({
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  postal_code: z.string(),
  country: z.string(),
})

export const PaymentStatusSchema = z.enum([
  "succeeded",
  "pending",
  "failed",
  "refunded",
  "partially_refunded",
])

export const OrderStatusSchema = z.enum([
  "draft",
  "pending_payment",
  "processing",
  "ready_for_pickup",
  "shipped",
  "delivered",
  "cancelled",
])

export const OrdersSchema = z.object({
  id: z.number(),
  amount: z.number(),
  createdAt: z.date(),
  paymentStatus: PaymentStatusSchema,
  customerName: z.string().nullable(),
  shipping_address: AddressSchema,
  billing_address: AddressSchema,
  orderItem: z.array(
    z.object({
      quantity: z.number(),
      product: z.object({
        name: z.string(),
        price: z.number(),
      }),
    }),
  ),
})

export const OrderSchema = z.object({
  id: z.number(),
  amount: z.number(),
  createdAt: z.date(),
  orderItem: z.array(
    z.object({
      quantity: z.number(),
      product: z.object({
        name: z.string(),
        price: z.number(),
      }),
    }),
  ),
})

export type Orders = z.infer<typeof OrdersSchema>
export type Order = z.infer<typeof OrderSchema>
