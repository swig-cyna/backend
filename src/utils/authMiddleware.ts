import { MiddlewareHandler } from "hono"
import { auth } from "./auth"

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    c.set("user", session ? session.user : null)
    c.set("session", session ? session.session : null)

    await next()
  } catch (error) {
    console.error(error)
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  return await next()
}

export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const allowedRoles = ["admin", "superadmin", "support"]

  if (!allowedRoles.includes(user.role)) {
    return c.json({ error: "Forbidden: Insufficient permissions" }, 403)
  }

  if (!user.twoFactorEnabled) {
    return c.json({ error: "2FA Required" }, 403)
  }

  return await next()
}
