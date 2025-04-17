import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import {
  ConfirmPaymentSchema,
  CreatePaymentSchema,
  OrderSchema,
  PaymentSchema,
} from "./schemas"

const tags = ["Payments"]

export const getPayments = createRoute({
  tags,
  path: "/payments",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(PaymentSchema), "Get all payments"),
  },
})

export const getPayment = createRoute({
  tags,
  path: "/payments/{id}",
  method: "get",
  params: z.object({ id: z.string() }),
  responses: {
    [Status.OK]: jsonContent(z.any(), "Get payment by ID"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Payment not found",
    ),
  },
})

export const createPaymentIntent = createRoute({
  tags,
  path: "/payments/create-intent",
  method: "post",
  request: {
    body: jsonContent(CreatePaymentSchema, "Payment intent creation data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(
      z.object({
        clientSecret: z.string(),
        paymentId: z.number(),
      }),
      "Payment intent created",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "User or product not found or missing Stripe customer ID",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string().optional(),
      }),
      "Payment intent creation failed",
    ),
  },
})

export const confirmPayment = createRoute({
  tags,
  path: "/payments/confirm",
  method: "post",
  request: {
    body: jsonContent(ConfirmPaymentSchema, "Payment confirmation data"),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
        order: OrderSchema.optional(),
      }),
      "Payment confirmed successfully",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        success: z.boolean().optional(),
        error: z.string().optional(),
        message: z.string().optional(),
      }),
      "Payment failed or incomplete",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Server error",
    ),
  },
})

export const sendReceipt = createRoute({
  tags,
  path: "/payments/send-receipt",
  method: "post",
  request: {
    body: jsonContent(
      z.object({
        paymentId: z.number(),
        userId: z.string(),
      }),
      "Send receipt data",
    ),
  },
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      "Receipt sent successfully",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        success: z.boolean().optional(),
        error: z.string().optional(),
        message: z.string().optional(),
      }),
      "Failed to send receipt",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Server error",
    ),
  },
})

export type GetPaymentsRoute = typeof getPayments
export type GetPaymentRoute = typeof getPayment
export type CreatePaymentIntentRoute = typeof createPaymentIntent
export type ConfirmPaymentRoute = typeof confirmPayment
export type SendReceiptRoute = typeof sendReceipt
