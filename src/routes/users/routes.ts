import { usersResponseSchema } from "@/db/schema/users"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"

const tags = ["User"]

export const getUsers = createRoute({
  tags,
  path: "/users",
  method: "get",
  responses: {
    [Status.OK]: jsonContent(z.array(usersResponseSchema), "Get users"),
  },
})

export const getUserById = createRoute({
  tags,
  path: "/users/{id}",
  method: "get",
  params: z.object({ id: z.number() }),
  responses: {
    [Status.OK]: jsonContent(usersResponseSchema, "Get user by id"),
    [Status.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "User not found",
        }),
      }),
      "User not found"
    ),
    [Status.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string().openapi({
          example: "Invalid id",
        }),
      }),
      "Invalid id"
    ),
  },
})

export type GetUsersRoute = typeof getUsers
export type GetUserByIdRoute = typeof getUserById
