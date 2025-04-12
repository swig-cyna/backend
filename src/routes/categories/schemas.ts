import { z } from "@hono/zod-openapi"

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
})

export const CategoryEditSchema = CategorySchema.omit({
  id: true,
})

export type Category = z.infer<typeof CategorySchema>
