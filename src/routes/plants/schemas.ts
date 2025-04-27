import { z } from "@hono/zod-openapi"

export const PlantSchema = z.object({
  name: z.string(),
  price: z.number(),
  discount: z.number(),
  description: z.string(),
  interval: z.enum(["day", "week", "month", "year"]).default("month"),
  stripe_product_id: z.string(),
  stripe_price_id: z.string(),
  created_at: z.date(),
})

export const CreatePlantSchema = z.object({
  name: z.string(),
  price: z.number(),
  discount: z.number(),
  description: z.string(),
  interval: z.enum(["day", "week", "month", "year"]).default("month"),
})
