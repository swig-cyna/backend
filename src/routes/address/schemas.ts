import { z } from "@hono/zod-openapi"

export const AddressSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  alias: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  postal_code: z.string(),
  country: z.string().length(2),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const AddressCreateSchema = AddressSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

export type Address = z.infer<typeof AddressSchema>
export type AdressCreate = z.infer<typeof AddressCreateSchema>
