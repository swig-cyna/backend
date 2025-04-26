import { z } from "@hono/zod-openapi"

export const SubscriptionSchema = z.object({
  id: z.number(),
  userId: z.string(),
  plantId: z.number(),
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  status: z.string(),
  currentPeriodEnd: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  canceledAt: z.date().nullable(),
})

export const SubscriptionWithPlantSchema = SubscriptionSchema.extend({
  plant_name: z.string().nullable(),
  plant_price: z.number().nullable(),
  plant_discount: z.number().nullable(),
  plant_description: z.string().nullable(),
  plant_interval: z
    .enum(["day", "week", "month", "year"])
    .default("month")
    .nullable(),
})

export const CreateSubscriptionSchema = z.object({
  userId: z.string(),
  plantId: z.number(),
  paymentMethodId: z.string(),
  interval: z.string(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>
