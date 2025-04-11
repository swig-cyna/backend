import { z } from "@hono/zod-openapi"

export const ProductSchema = z.object({
  name: z.string(),
  price_month: z.number(),
  price_year: z.number(),
  description: z.string(),
  currency: z.string().default("EUR"),
  interval: z.enum(["day", "week", "month", "year"]).default("month"),
  images: z.array(z.string()).optional(),
})

export const CreateProductSchema = ProductSchema.extend({
  images: z.array(z.string()).optional(),
})

export type Product = z.infer<typeof ProductSchema>
