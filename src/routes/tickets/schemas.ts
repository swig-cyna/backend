import { z } from "@hono/zod-openapi"

export const TicketSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  user_name: z.string(),
  user_email: z.string(),
  title: z.string(),
  description: z.string(),
  theme: z.string(),
  status: z.enum(["open", "in_progress", "closed"]),
  assigned_to: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  closed_at: z.string().datetime().nullable(),
})

export const TicketCreateSchema = TicketSchema.omit({
  id: true,
  status: true,
  created_at: true,
  updated_at: true,
  closed_at: true,
  assigned_to: true,
  user_id: true,
}).extend({
  status: z.enum(["open"]).default("open"),
  user_name: z.string().min(1),
  user_email: z.string().email(),
  title: z.string().min(1),
  description: z.string().min(1),
  theme: z.string().min(1),
})

export type Ticket = z.infer<typeof TicketSchema>
export type TicketCreate = z.infer<typeof TicketCreateSchema>
