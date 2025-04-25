import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import {
  CreateSubscriptionSchema,
  SubscriptionSchema,
  SubscriptionWithPlantSchema,
} from "./schemas"

const tags = ["Subscriptions"]

export const getSubscriptions = createRoute({
  tags,
  path: "/subscriptions",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(SubscriptionSchema), "Get subscriptions"),
  },
})

export const getSubscription = createRoute({
  tags,
  path: "/subscriptions/{id}",
  method: "get",
  params: z.object({ id: z.string() }),
  responses: {
    [Status.OK]: jsonContent(
      z.array(SubscriptionWithPlantSchema),
      "Get subscription",
    ),
  },
})

export const createSubscription = createRoute({
  tags,
  path: "/subscriptions",
  method: "post",
  request: {
    body: jsonContent(CreateSubscriptionSchema, "Subscription creation data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(SubscriptionSchema, "Subscription created"),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "User not found or missing Stripe customer ID",
    ),
  },
})

export const cancelSubscription = createRoute({
  tags,
  path: "/subscriptions/{id}/cancel",
  method: "delete",
  params: z.object({ id: z.number() }),
  responses: {
    [Status.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Subscription canceled successfully",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Subscription not found",
    ),
  },
})

export type GetSubscriptionsRoute = typeof getSubscriptions
export type CreateSubscriptionRoute = typeof createSubscription
export type GetSubscriptionRoute = typeof getSubscription
export type CancelSubscriptionRoute = typeof cancelSubscription
