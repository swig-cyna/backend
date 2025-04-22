import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { AttachPaymentMethodSchema } from "./schemas"

const tags = ["paymentMethods"]

export const getPaymentMethods = createRoute({
  tags,
  path: "/payment-methods/{id}",
  method: "get",
  params: z.object({ id: z.string() }),
  responses: {
    [Status.OK]: jsonContent(z.any(), "Get payment methods"),
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

export const attachPaymentMethod = createRoute({
  tags,
  path: "/payment-methods/attach-payment-method",
  method: "post",
  request: {
    body: jsonContent(
      AttachPaymentMethodSchema,
      "Payment method attachment data",
    ),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Payment method attached successfully",
    ),
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

export const updatePaymentMethod = createRoute({
  tags,
  path: "/payment-methods",
  method: "put",
  request: {
    body: jsonContent(
      z.object({
        paymentMethodId: z.string(),
        name: z.string().optional(),
        expMonth: z.number().optional(),
        expYear: z.number().optional(),
      }),
      "Payment method update data",
    ),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Payment method update successfully",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Method not found",
    ),
  },
})

export const deletePaymentMethod = createRoute({
  tags,
  path: "/payment-methods/{id}",
  method: "delete",
  params: z.object({ id: z.string() }),
  responses: {
    [Status.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Payment method delete successfully",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Method not found",
    ),
  },
})

export type AttachPaymentMethodRoute = typeof attachPaymentMethod
export type GetPaymentMethodsRoute = typeof getPaymentMethods
export type UpdatePaymentMethodRoute = typeof updatePaymentMethod
export type DeletePaymentMethodRoute = typeof deletePaymentMethod
