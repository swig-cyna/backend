import env from "@/env.js"
import type { AppRouteHandler } from "@/utils/types.js"
import { sign } from "hono/jwt"
import type { SignInRoute, SignUpRoute } from "./routes.js"

export const signIn: AppRouteHandler<SignInRoute> = (c) =>
  c.json({
    message: "Logged content",
  })

export const signUp: AppRouteHandler<SignUpRoute> = async (c) => {
  const payload = {
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  }

  const token = await sign(payload, env.JWT_SECRET)

  return c.json({
    token,
  })
}
