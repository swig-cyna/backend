import { z } from "@hono/zod-openapi"

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  // eslint-disable-next-line camelcase
  created_at: z.date(),
})

export type Product = z.infer<typeof ProductSchema>
