import db from "@/db"
import { users } from "@/db/schema"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { eq } from "drizzle-orm"
import type { GetUserByIdRoute, GetUsersRoute } from "./routes"

export const getUsers: AppRouteHandler<GetUsersRoute> = async (c) => {
  const usersList = await db.query.users.findMany({
    columns: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  })

  return c.json(usersList)
}

export const getUserById: AppRouteHandler<GetUserByIdRoute> = async (c) => {
  const { id } = c.req.param()

  if (isNaN(Number(id))) {
    return c.json({ error: "Invalid id" }, Status.BAD_REQUEST)
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(id)),
    columns: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
    },
  })

  if (!user) {
    return c.json({ error: "User not found" }, Status.NOT_FOUND)
  }

  return c.json(user, Status.OK)
}
