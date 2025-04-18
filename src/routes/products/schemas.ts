import { z } from "@hono/zod-openapi"
import { CategorySchema } from "../categories/schemas"

export const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  currency: z.string().default("EUR"),
  interval: z.enum(["day", "week", "month", "year"]).default("month"),
  images: z.array(z.string()).optional(),
  categories: z.array(CategorySchema).optional(),
})

export const CreateProductSchema = ProductSchema.extend({
  images: z.array(z.string()).optional(),
  category_id: z.number().optional().nullable(),
}).omit({
  categories: true,
})

export type Product = z.infer<typeof ProductSchema>
