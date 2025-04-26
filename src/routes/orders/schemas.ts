import { z } from "@hono/zod-openapi"

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

export type Order = z.infer<typeof OrderSchema>
