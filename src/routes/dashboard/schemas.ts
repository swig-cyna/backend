import { z } from "@hono/zod-openapi"

export const StatisticsSchema = z.object({
  users: z.object({
    count: z.number(),
    growth: z.number(),
  }),
  products: z.object({
    count: z.number(),
    newCount: z.number(),
  }),
  orders: z.object({
    count: z.number(),
    growth: z.number(),
  }),
  revenue: z.object({
    amount: z.number(),
    growth: z.number(),
    currency: z.string(),
  }),
})

export const RecentOrderSchema = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.string(),
  amount: z.number(),
  status: z.string(),
  userImage: z.string().nullable(),
  date: z.string(),
})

export const RecentTicketSchema = z.object({
  id: z.number(),
  title: z.string(),
  userName: z.string(),
  status: z.string(),
  userImage: z.string().nullable(),
  date: z.string(),
})

export const ChartDataPointSchema = z.object({
  name: z.string(),
  total: z.number(),
})
