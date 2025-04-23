import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { createAddressRoute } from "./routes"

export const createAddress: AppRouteHandler<createAddressRoute> = async (c) => {
  try {
    const user = c.get("user")

    if (!user || !user.id) {
      return c.json({ error: "Unauthorized" }, Status.UNAUTHORIZED)
    }

    const data = c.req.valid("json")

    const newAddress = await db
      .insertInto("address")
      .values({
        ...data,
        user_id: user.id,
      })
      .returningAll()
      .executeTakeFirst()

    return c.json(newAddress, Status.CREATED)
  } catch (err) {
    const { message } = err as Error

    if (message.toLowerCase().includes("validation")) {
      return c.json({ error: "Invalid data" }, Status.BAD_REQUEST)
    }

    console.error("Erreur lors de la création de l'adresse:", err)

    return c.json(
      { error: message || "Internal server error" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
