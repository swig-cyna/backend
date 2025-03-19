import { z } from "@hono/zod-openapi"

export const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  currency: z.string(),
  interval: z.enum(["day", "week", "month", "year"]),
})

export type Product = z.infer<typeof ProductSchema>
