import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { AddressSchema } from "../address/schemas"
import { OrderSchema, OrdersSchema } from "./schemas"

const tags = ["Orders"]

export const getOrders = createRoute({
  tags,
  path: "/orders",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(OrdersSchema), "Get all orders"),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
  },
})

export const getOrder = createRoute({
  tags,
  path: "/orders/{id}",
  method: "get",
  params: z.object({ id: z.string() }),
  responses: {
    [Status.OK]: jsonContent(z.array(OrderSchema), "Get order by ID"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Order not found",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Stripe error",
    ),
  },
})

export const updateShippingAddress = createRoute({
  tags,
  path: "/orders/{id}/shipping-address",
  method: "patch",
  params: z.object({ id: z.string() }),
  request: {
    body: jsonContent(AddressSchema.partial(), "Change shipping address"),
  },
  responses: {
    [Status.OK]: jsonContent(OrdersSchema, "Adresse de livraison mise à jour"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Commande introuvable",
    ),
  },
})

export const updateBillingAddress = createRoute({
  tags,
  path: "/orders/{id}/billing-address",
  method: "patch",
  params: z.object({ id: z.string() }),
  request: {
    body: jsonContent(AddressSchema.partial(), "Change billing address"),
  },
  responses: {
    [Status.OK]: jsonContent(
      OrdersSchema,
      "Adresse de facturation mise à jour",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string() }),
      "Commande introuvable",
    ),
  },
})

export type GetOrdersRoute = typeof getOrders
export type GetOrderRoute = typeof getOrder
export type UpdateShippingAddressRoute = typeof updateShippingAddress
export type UpdateBillingAddressRoute = typeof updateBillingAddress
