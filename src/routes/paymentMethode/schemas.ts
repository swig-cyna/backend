import { z } from "@hono/zod-openapi"

export const AttachPaymentMethodSchema = z.object({
  userId: z.string(),
  paymentMethodId: z.string(),
})
