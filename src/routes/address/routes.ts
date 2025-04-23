import { sessionMiddleware } from "@/utils/authMiddleware"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { AddressCreateSchema, AddressSchema } from "./schemas"

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

export type createAddressRoute = typeof createAddress
