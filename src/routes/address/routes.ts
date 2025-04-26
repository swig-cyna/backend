import { sessionMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import {
  AddressCreateSchema,
  AddressSchema,
  AddressUpdateSchema,
} from "./schemas"

const tags = ["Address"]

export const createAddress = createRoute({
  tags,
  path: "/addresses",
  method: "post",
  middleware: [sessionMiddleware],
  request: {
    body: jsonContent(AddressCreateSchema, "Address data"),
  },
  responses: {
    [Status.CREATED]: jsonContent(AddressSchema, "Address created"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid data" }) }),
      "Invalid data",
    ),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Unauthorized" }) }),
      "Unauthorized",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({ example: "Internal server error" }),
      }),
      "Internal server error",
    ),
  },
})

export const getAddresses = createRoute({
  tags,
  path: "/addresses",
  method: "get",
  middleware: [sessionMiddleware],
  responses: {
    [Status.OK]: jsonContent(z.array(AddressSchema), "List of addresses"),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Unauthorized" }) }),
      "Unauthorized",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({ example: "Internal server error" }),
      }),
      "Internal server error",
    ),
  },
})

export const updateAddress = createRoute({
  tags,
  path: "/addresses/{id}",
  method: "put",
  middleware: [sessionMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContent(AddressUpdateSchema, "Address update data"),
  },
  responses: {
    [Status.OK]: jsonContent(AddressSchema, "Address updated"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Address not found" }) }),
      "Address not found",
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid data" }) }),
      "Invalid data",
    ),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Unauthorized" }) }),
      "Unauthorized",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({ example: "Internal server error" }),
      }),
      "Internal server error",
    ),
  },
})

export const deleteAddress = createRoute({
  tags,
  path: "/addresses/{id}",
  method: "delete",
  middleware: [sessionMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [Status.OK]: jsonContent(AddressSchema, "Address deleted"),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Invalid id" }) }),
      "Invalid id",
    ),
    [Status.NOT_FOUND]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Address not found" }) }),
      "Address not found",
    ),
    [Status.UNAUTHORIZED]: jsonContent(
      z.object({ error: z.string().openapi({ example: "Unauthorized" }) }),
      "Unauthorized",
    ),
    [Status.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string().openapi({ example: "Internal server error" }),
      }),
      "Internal server error",
    ),
  },
})

export type CreateAddressRoute = typeof createAddress
export type GetAddressesRoute = typeof getAddresses
export type UpdateAddressesRoute = typeof updateAddress
export type DeleteAddressesRoute = typeof deleteAddress
