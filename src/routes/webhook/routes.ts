import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"

const tags = ["WebHooks_stripe"]

export const handleStripeWebhook = createRoute({
  tags,
  path: "/webhook/stripe",
  method: "post",
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        received: z.boolean(),
      }),
      "Webhook processed",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string() }),
      "Invalid signature",
    ),
  },
})

export type HandleStripeWebhookRoute = typeof handleStripeWebhook
