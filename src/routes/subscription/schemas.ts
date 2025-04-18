import { z } from "@hono/zod-openapi"

export const SubscriptionSchema = z.object({
  id: z.number(),
  userId: z.string(),
  productId: z.number(),
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  status: z.string(),
  currentPeriodEnd: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  canceledAt: z.date().nullable(),
  quantity: z.number(),
})

export const CreateSubscriptionSchema = z.object({
  userId: z.string(),
  productId: z.number(),
  quantity: z.number(),
  paymentMethodeId: z.string(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>
