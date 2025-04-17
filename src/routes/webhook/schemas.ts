import { z } from "@hono/zod-openapi"

export const WebhookEventSchema = z.object({
  id: z.string(),
  object: z.literal("event"),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
})

export type WebhookEvent = z.infer<typeof WebhookEventSchema>
