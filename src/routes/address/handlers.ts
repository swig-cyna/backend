import { db } from "@/db"
import type { AppRouteHandler } from "@/utils/types"
import { Status } from "better-status-codes"
import { CreateAddressRoute, GetAddressesRoute } from "./routes"

export const createAddress: AppRouteHandler<CreateAddressRoute> = async (c) => {
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

export const getAddresses: AppRouteHandler<GetAddressesRoute> = async (c) => {
  try {
    const user = c.get("user")

    if (!user?.id) {
      return c.json({ error: "Unauthorized" }, Status.UNAUTHORIZED)
    }

    const addresses = await db
      .selectFrom("address")
      .selectAll()
      .where("user_id", "=", user.id)
      .orderBy("created_at", "desc")
      .execute()

    return c.json(addresses, Status.OK)
  } catch (err) {
    console.error("Erreur lors de la récupération des adresses:", err)

    return c.json(
      { error: (err as Error).message || "Internal server error" },
      Status.INTERNAL_SERVER_ERROR,
    )
  }
}
