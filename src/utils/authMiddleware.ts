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

export const dashboardMiddleware: MiddlewareHandler = async (c, next) => {
  if (c.req.path.startsWith("/admin")) {
    const user = c.get("user")

    const is2FAEnabled = user?.twoFactorEnabled

    if (!is2FAEnabled) {
      return c.json({ error: "2FA Required" }, 401)
    }

    return await next()
  }

  return await next()
}

export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const allowedRoles = ["admin", "superadmin"]

  if (!allowedRoles.includes(user.role)) {
    return c.json({ error: "Forbidden: Insufficient permissions" }, 403)
  }

  const is2FAEnabled = user?.twoFactorEnabled

  if (!is2FAEnabled) {
    return c.json({ error: "2FA Required" }, 401)
  }

  return await next()
}

export const superadminMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const allowedRoles = ["superadmin"]

  if (!allowedRoles.includes(user.role)) {
    return c.json({ error: "Forbidden: Insufficient permissions" }, 403)
  }

  const is2FAEnabled = user?.twoFactorEnabled

  if (!is2FAEnabled) {
    return c.json({ error: "2FA Required" }, 401)
  }

  return await next()
}
