import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { ListUsersRoute } from "./routes"

export const listUsersHandler: AppRouteHandler<ListUsersRoute> = async (c) => {
  const { role, id, limit = 20, offset = 0 } = c.req.valid("query")
  let query = db
    .selectFrom("user")
    .select(["id", "name", "role"])
    .limit(Number(limit))
    .offset(Number(offset))

  if (role) {
    const roles = role.split(",").map((r) => r.trim())
    query = query.where("role", "in", roles)
  }

  if (id) {
    query = query.where("id", "=", id)
  }

  const users = await query.execute()
  console.log(users)

  return c.json({ users }, Status.OK)
}
