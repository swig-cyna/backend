import env from "@/env"
import responses from "@/utils/responses"
import { jsonContent } from "@/utils/router"
import { createRoute, z } from "@hono/zod-openapi"
import { Status } from "better-status-codes"
import { jwt } from "hono/jwt"

const tags = ["Auth"]

export const signIn = createRoute({
  tags,
  path: "/auth/signin",
  method: "get",
  middleware: jwt({ secret: env.JWT_SECRET }),
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        message: z.string().openapi({
          example: "Logged content",
        }),
      }),
      "Session"
    ),
    [Status.UNAUTHORIZED]: responses.unauthorized,
  },
})

export const signUp = createRoute({
  tags,
  path: "/auth/signup",
  method: "post",
  responses: {
    [Status.OK]: jsonContent(
      z.object({
        token: z.string().openapi({
          example: "TOKEN",
        }),
      }),
      "Generate session token"
    ),
  },
})

export type SignInRoute = typeof signIn
export type SignUpRoute = typeof signUp
